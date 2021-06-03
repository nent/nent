import { RafCallback } from '@stencil/core'
import { warn } from '../../../services/common'
import { IEventEmitter } from '../../../services/common/interfaces'
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
  RouteViewOptions,
  ROUTE_EVENTS,
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
  constructor(
    private win: Window,
    private readonly writeTask: (t: RafCallback) => void,
    public eventBus: IEventEmitter,
    public actions: IEventEmitter,
    public root: string = '',
    public appTitle: string = '',
    public transition: string = '',
    public scrollTopOffset = 0,
  ) {
    this.history = new HistoryService(win, root)

    this.removeHandler = this.history.listen(
      (location: LocationSegments) => {
        this.location = location
        this.sendLocationNotifications(location)
      },
    )

    this.enableActionListener()

    if (commonState.dataEnabled) this.enableDataProviders()
    else {
      const dataSubscription = onCommonStateChange(
        'dataEnabled',
        enabled => {
          if (enabled) {
            this.enableDataProviders()
            dataSubscription()
          }
        },
      )
    }

    this.sendLocationNotifications(this.history.location)
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

  public enableActionListener() {
    this.listener = new NavigationActionListener(
      this,
      this.eventBus,
      this.actions,
    )
  }

  private sendLocationNotifications(location: LocationSegments) {
    this.routeData?.changed.emit(DATA_EVENTS.DataChanged, {
      changed: ['route'],
    })
    this.listener?.notifyRouteChanged(location)
    this.listener?.notifyRouteFinalized(location)
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

  viewsUpdated(options: RouteViewOptions = {}) {
    if (options.scrollToId) {
      const elm = this.win.document.querySelector(
        '#' + options.scrollToId,
      )
      if (elm) {
        elm.scrollIntoView()
        return
      }
    }
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset)
  }

  atRoot() {
    return (
      this.location?.pathname == this.root ||
      this.location.pathname == '/'
    )
  }

  finalize(startUrl?: string) {
    this.captureInnerLinks(this.win.document.body)

    if (startUrl && this.atRoot()) {
      const search = this.location.search
      this.replaceWithRoute(stripBasename(startUrl!, this.root))
      this.location.search = search
    }

    this.eventBus.emit(ROUTE_EVENTS.Initialized, {})
  }

  goBack() {
    this.location.pathname = this.history.previousLocation.pathname
    this.history.goBack()
  }

  goToParentRoute() {
    const parentSegments = this.history.location.pathParts?.slice(
      0,
      -1,
    )
    if (parentSegments) {
      this.goToRoute(addLeadingSlash(parentSegments.join('/')))
    } else {
      this.goBack()
    }
  }

  public scrollTo(scrollToLocation: number) {
    if (Array.isArray(this.history.location.scrollPosition)) {
      if (
        this.history.location &&
        Array.isArray(this.history.location.scrollPosition)
      ) {
        this.win.scrollTo(
          this.history.location.scrollPosition[0],
          this.history.location.scrollPosition[1],
        )
      }
      return
    }

    // Okay, the frame has passed. Go ahead and render now
    this.writeTask(() => {
      this.win.scrollTo(0, scrollToLocation || 0)
    })
  }

  public goToRoute(path: string) {
    const pathName = resolvePathname(path, this.location.pathname)
    this.location.pathname = pathName
    this.history.push(pathName)
  }

  public replaceWithRoute(path: string) {
    //const newPath = resolvePathname(path, this.location.pathname)
    //this.location.pathname = newPath
    this.history.replace(path)
  }

  public matchPath(
    options: MatchOptions = {},
    route: Route | null = null,
  ): MatchResults | null {
    const match = matchPath(this.location, options)
    if (route && match) {
      if (match.isExact) this.listener.notifyMatchExact(route, match)
      else this.listener.notifyMatch(route, match)
    }
    return match
  }

  public resolvePathname(url: string, parentUrl?: string) {
    return resolvePathname(url, parentUrl || this.location.pathname)
  }

  public normalizeChildUrl(childUrl: string, parentUrl: string) {
    return ensureBasename(childUrl, parentUrl)
  }

  public isModifiedEvent(ev: MouseEvent) {
    return ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
  }

  public async adjustTitle(pageTitle: string) {
    if (this.win.document) {
      if (pageTitle) {
        this.win.document.title = `${pageTitle} | ${
          this.appTitle || this.win.document.title
        }`
      } else if (this.appTitle) {
        this.win.document.title = `${this.appTitle}`
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
    let { path, exact, pageTitle, transition, scrollTopOffset } =
      routeElement

    const parent = parentElement?.route || null
    if (parent) {
      path = this.normalizeChildUrl(routeElement.path, parent.path)
      transition = transition || parent?.transition || transition
    } else {
      path = this.adjustRootViewUrls(routeElement.path)
    }
    routeElement.path = path
    routeElement.transition = transition || this.transition

    if (this.routes.find(r => r.path == path)) {
      warn(`route: duplicate route detected for ${path}.`)
    }

    const route = new Route(
      this,
      routeElement,
      routeElement.path,
      parent,
      exact,
      pageTitle || parent?.pageTitle,
      routeElement.transition,
      scrollTopOffset,
      matchSetter,
      () => {
        this.routes = this.routes.filter(r => r == route)
      },
    )
    return route
  }
}
