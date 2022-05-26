import { RafCallback } from '@stencil/core'
import { warn } from '../../../services/common/logging'
import {
  IEventEmitter,
  PageData,
} from '../../../services/common/interfaces'
import {
  commonState,
  onCommonStateChange,
} from '../../../services/common/state'
import { addDataProvider } from '../../../services/data/factory'
import { DATA_EVENTS } from '../../../services/data/interfaces'
import { Route } from '../../n-view/services/route'
import {
  getSessionVisits,
  getStoredVisits,
  getVisits,
} from '../../n-view/services/visits'
import { NavigationActionListener } from './actions'
import { captureElementsEventOnce } from './elements'
import { HistoryService } from './history'
import {
  LocationSegments,
  MatchOptions,
  MatchResults,
} from './interfaces'
import { RoutingDataProvider } from './provider'
import { isAbsolute, resolvePathname } from './utils/location'
import {
  addLeadingSlash,
  ensureBasename,
  hasBasename,
  isFilename,
  stripBasename,
} from './utils/path'
import { matchPath } from './utils/path-match'

export class RouterService {
  public location!: LocationSegments
  private readonly removeHandler!: () => void
  private listener!: NavigationActionListener
  public history: HistoryService
  public routes: Route[] = []
  private routeData?: RoutingDataProvider
  private queryData?: RoutingDataProvider
  private visitData?: RoutingDataProvider
  public startUrl: string | undefined
  constructor(
    private win: Window,
    private readonly writeTask: (t: RafCallback) => void,
    public eventBus: IEventEmitter,
    public actions: IEventEmitter,
    public root: string = '',
    public appTitle: string = '',
    public appDescription: string = '',
    public appKeywords: string = '',
    public transition: string = '',
    public scrollTopOffset = 0,
  ) {
    this.history = new HistoryService(win, root)

    this.listener = new NavigationActionListener(
      this,
      this.eventBus,
      this.actions,
    )

    if (commonState.dataEnabled) this.enableDataProviders()
    else {
      const dataSubscription = onCommonStateChange(
        'dataEnabled',
        enabled => {
          if (enabled) {
            this.enableDataProviders()
          }
          dataSubscription()
        },
      )
    }

    this.removeHandler = this.history.listen(
      (location: LocationSegments) => {
        this.location = location
        this.listener.notifyRouteChanged(location)
        this.routeData?.changed.emit(DATA_EVENTS.DataChanged, {
          changed: ['route'],
        })
      },
    )

    this.listener.notifyRouteChanged(this.history.location)
  }

  public async enableDataProviders() {
    this.routeData = new RoutingDataProvider((key: string) => {
      let route: any = { data: this.location!.params }
      if (this.hasExactRoute())
        route = Object.assign(route, this.exactRoute)
      return route.data[key] || route[key]
    })
    addDataProvider('route', this.routeData)

    this.queryData = new RoutingDataProvider(
      (key: string) => this.location!.query[key],
    )
    addDataProvider('query', this.queryData)

    this.queryData = new RoutingDataProvider(
      (key: string) => this.location!.query[key],
    )

    this.visitData = new RoutingDataProvider(async (key: string) => {
      switch (key) {
        case 'all':
          const all = await getVisits()
          return JSON.stringify(all).split(`"`).join(`'`)
        case 'stored':
          const stored = await getStoredVisits()
          return JSON.stringify(stored).split(`"`).join(`'`)
        case 'session':
          const session = await getSessionVisits()
          return JSON.stringify(session).split(`"`).join(`'`)
      }
    })
    addDataProvider('visits', this.visitData)
  }

  adjustRootViewUrls(path: string): string {
    let stripped =
      this.root && hasBasename(path, this.root)
        ? path.slice(this.root.length)
        : path
    if (isFilename(this.root)) {
      return '#' + addLeadingSlash(stripped)
    }
    return addLeadingSlash(stripped)
  }

  atRoot() {
    return (
      this.location?.pathname == this.root ||
      this.location.pathname == '/'
    )
  }

  public initialize(startUrl?: string) {
    this.startUrl = startUrl

    if (startUrl && this.atRoot())
      this.replaceWithRoute(stripBasename(startUrl!, this.root))

    this.captureInnerLinks(this.win.document.body)

    this.listener.notifyRouterInitialized()
    if (this.routes.every(r => r.completed)) {
      this.allRoutesComplete()
    }
  }

  private allRoutesComplete() {
    if (!this.hasExactRoute()) {
      this.setPageTags({
        title: 'Not found',
        robots: 'nofollow',
      })
    }
    this.listener.notifyRouteFinalized(this.location)
  }

  public routeCompleted() {
    if (this.routes.every(r => r.completed)) {
      this.allRoutesComplete()
    }
  }

  public async goBack() {
    if (this.exactRoute) {
      const nextRoute = await this.exactRoute.getNextRoute()
      if (nextRoute) {
        this.goToRoute(nextRoute?.path)
        return
      }
    }
    this.listener.notifyRouteChangeStarted(
      this.history.previousLocation.pathname,
    )
    this.history.goBack()
  }

  public async goNext() {
    if (this.exactRoute) {
      if (!this.exactRoute.isValidForNext()) return
      const nextRoute = await this.exactRoute.getNextRoute()
      // if the route returns null, then we can't move due to validation
      if (nextRoute) {
        this.goToRoute(nextRoute!.path)
        return
      }
    }

    this.goToParentRoute()
  }

  public goToParentRoute() {
    if (this.exactRoute) {
      const parentRoute = this.exactRoute.getParentRoute()
      if (parentRoute) {
        this.goToRoute(parentRoute!.path)
        return
      }
    }

    const parentSegments = this.history.location.pathParts?.slice(
      0,
      -1,
    )
    if (parentSegments) {
      this.goToRoute(addLeadingSlash(parentSegments.join('/')))
    } else {
      this.goToRoute(this.startUrl || '/')
    }
  }

  public scrollTo(scrollOffset: number) {
    // Okay, the frame has passed. Go ahead and render now
    this.writeTask(() => {
      // first check if we have a stored scroll location
      if (Array.isArray(this.history.location?.scrollPosition)) {
        this.win.scrollTo(
          this.history.location.scrollPosition[0],
          this.history.location.scrollPosition[1],
        )
        return
      }

      this.win.scrollTo(0, scrollOffset || 0)
    })
  }

  public scrollToId(id: string) {
    this.writeTask(() => {
      const elm = this.win.document.querySelector('#' + id)
      elm?.scrollIntoView()
    })
  }

  public goToRoute(path: string) {
    this.listener.notifyRouteChangeStarted(path)
    const pathName = resolvePathname(path, this.location.pathname)
    this.history.push(pathName)
  }

  public replaceWithRoute(path: string) {
    this.listener.notifyRouteChangeStarted(path)
    const pathName = resolvePathname(path, this.location.pathname)
    this.history.replace(pathName)
  }

  public matchPath(
    options: MatchOptions = {},
    route: Route | null = null,
    sendEvent: boolean = true,
  ): MatchResults | null {
    const match = matchPath(this.location, options)
    if (route && match && sendEvent) {
      if (match.isExact) this.listener.notifyMatchExact(route, match)
      else this.listener.notifyMatch(route, match)
    }
    return match
  }

  public resolvePathname(path: string, parentPath?: string) {
    return resolvePathname(path, parentPath || this.location.pathname)
  }

  public normalizeChildUrl(childUrl: string, parentUrl: string) {
    return ensureBasename(childUrl, parentUrl)
  }

  public isModifiedEvent(ev: MouseEvent) {
    return ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
  }

  public async setPageTags(pageData: PageData) {
    const { title, description, keywords, robots } = pageData
    if (this.win.document) {
      this.win.document.title = [title, this.appTitle]
        .filter(v => v)
        .join(' | ')

      if (robots)
        this.win.document
          .querySelectorAll('meta[name*=bot]')
          .forEach((element: Element) => {
            const metaTag = element as HTMLMetaElement
            metaTag.content = robots
          })

      const canonicalLink = this.win.document.querySelector(
        'link[rel=canonical]',
      ) as HTMLLinkElement
      if (canonicalLink) {
        const { protocol, host } = document.location
        const { pathname } = this.location
        canonicalLink.href = `${protocol}//${host}${pathname}`
      }

      this.win.document
        .querySelectorAll('meta[name*=description]')
        .forEach((element: Element) => {
          const metaTag = element as HTMLMetaElement
          metaTag.content = description || this.appDescription || ''
        })

      this.win.document
        .querySelectorAll('meta[name*=keywords]')
        .forEach((element: Element) => {
          const metaTag = element as HTMLMetaElement
          metaTag.content = keywords || this.appKeywords || ''
        })

      // If the only change to location is a hash change then do not scroll.
      if (this.history?.location?.hash) {
        this.scrollToId(this.history.location.hash.slice(1))
      } else {
        this.scrollTo(
          this.exactRoute?.scrollTopOffset || this.scrollTopOffset,
        )
      }
    }
  }

  captureInnerLinks(root: HTMLElement, fromPath?: string) {
    captureElementsEventOnce<HTMLAnchorElement, MouseEvent>(
      root,
      `a[href]`,
      'click',
      (el: HTMLAnchorElement, ev: MouseEvent) => {
        if (this.isModifiedEvent(ev) || !this?.history) return true

        if (!el.href.includes(location.origin) || el.target)
          return true

        ev.preventDefault()

        const path = el.href.replace(location.origin, '')
        return this.handleRouteLinkClick(
          path,
          fromPath || this.location.pathname,
        )
      },
    )
  }

  public get exactRoutes() {
    return this.routes.filter(r => r.match?.isExact)
  }

  public get matchedRoutes() {
    return this.routes.filter(r => r.match)
  }

  public get hasRoutes() {
    return this.routes.length > 0
  }

  public hasExactRoute() {
    return this.exactRoutes?.length > 0
  }

  public get exactRoute() {
    if (this.hasExactRoute()) return this.exactRoutes[0]
    return null
  }

  public handleRouteLinkClick(toPath: string, fromPath?: string) {
    const route = isAbsolute(toPath)
      ? toPath
      : this.normalizeChildUrl(toPath, fromPath || '/')
    if (
      fromPath &&
      route.startsWith(fromPath) &&
      route.includes('#')
    ) {
      const elId = toPath.substr(toPath.indexOf('#'))
      this.win.document?.querySelector(elId)?.scrollIntoView({
        behavior: 'smooth',
      })
      return
    }
    this.goToRoute(route)
  }

  public destroy() {
    this.removeHandler()
    this.listener.destroy()
    this.history.destroy()
    this.routes.forEach(r => r.destroy())
  }

  public createRoute(
    routeElement: HTMLNViewElement | HTMLNViewPromptElement,
    parentElement: HTMLNViewElement | null,
    matchSetter: (m: MatchResults | null) => void,
  ) {
    let {
      path,
      exact,
      pageTitle,
      pageDescription,
      pageKeywords,
      pageRobots,
      transition,
      scrollTopOffset,
    } = routeElement

    const parent = parentElement?.route || null
    if (parent) {
      path = this.normalizeChildUrl(routeElement.path, parent.path)
      transition = transition || parent?.transition || transition
    } else {
      path = this.adjustRootViewUrls(routeElement.path)
    }

    routeElement.path = path

    if (this.routes.find(r => r.path == path)) {
      warn(`route: duplicate route detected for ${path}.`)
    }

    const route = new Route(
      this,
      routeElement,
      path,
      parent,
      exact,
      {
        title: pageTitle || parent?.pageData.title,
        description: pageDescription,
        keywords: pageKeywords,
        robots: pageRobots || parent?.pageData.robots,
      },
      transition || this.transition,
      scrollTopOffset,
      matchSetter,
      () => {
        this.routes = this.routes.filter(r => r == route)
      },
    )

    return route
  }
}
