import { RafCallback } from '@stencil/core'
import { ROUTE_EVENTS } from '../../services/routing/interfaces'
import { slugify, warn } from '../common'
import { performLoadElementManipulation } from '../common/elements'
import { IEventEmitter } from '../common/interfaces'
import { commonState, onCommonStateChange } from '../common/state'
import { addDataProvider } from '../data/factory'
import { DATA_EVENTS } from '../data/interfaces'
import { NavigationActionListener } from '../navigation/actions'
import { captureElementsEventOnce } from '../navigation/elements'
import { HistoryService } from './history'
import {
  LocationSegments,
  MatchOptions,
  MatchResults,
  RouteViewOptions,
} from './interfaces'
import { RoutingDataProvider } from './provider'
import { Route } from './route'
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
  public routes: { [index: string]: Route } = {}
  private routeData?: RoutingDataProvider
  private queryData?: RoutingDataProvider
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

    if (commonState.actionsEnabled) this.enableActionListener()
    else {
      const actionSubscription = onCommonStateChange(
        'actionsEnabled',
        enabled => {
          if (enabled) {
            this.enableActionListener()
            actionSubscription()
          }
        },
      )
    }

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

  public enableDataProviders() {
    this.routeData = new RoutingDataProvider(
      (key: string) => this.location!.params[key],
    )
    addDataProvider('route', this.routeData)

    this.queryData = new RoutingDataProvider(
      (key: string) => this.location!.query[key],
    )
    addDataProvider('query', this.queryData)
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

  adjustRootViewUrls(url: string): string {
    let stripped =
      this.root && hasBasename(url, this.root)
        ? url.slice(this.root.length)
        : url
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

  finalize(startUrl: string) {
    this.captureInnerLinks(this.win.document.body)
    if (commonState.elementsEnabled) {
      performLoadElementManipulation(this.win.document.body)
    }

    if (
      startUrl &&
      startUrl.length > 1 &&
      this.location?.pathname === '/'
    ) {
      this.replaceWithRoute(stripBasename(startUrl, this.root))
    } else {
      this.eventBus.emit(ROUTE_EVENTS.Initialized, {})
    }
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
    const newPath = resolvePathname(path, this.location.pathname)
    this.location.pathname = newPath
    this.history.replace(newPath)
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
    return Object.keys(this.routes).filter(
      r => this.routes[r].match?.isExact,
    )
  }

  public get matchedRoutes() {
    return Object.keys(this.routes).filter(r => this.routes[r].match)
  }

  public get hasRoutes() {
    return Object.keys(this.routes).length > 0
  }

  public hasExactRoute() {
    return this.exactRoutes?.length > 0
  }

  public get exactRoute() {
    if (this.hasExactRoute()) return this.routes[this.exactRoutes[0]]
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
  }

  public createRoute(
    routeElement: HTMLNViewElement | HTMLNViewPromptElement,
    parentElement: HTMLNViewElement | null,
    matchSetter: (m: MatchResults | null) => void,
  ) {
    let {
      url,
      exact,
      pageTitle,
      transition,
      scrollTopOffset,
    } = routeElement

    const routeKey = slugify(url)

    if (this.routes[routeKey]) {
      warn(`route: duplicate route detected for ${url}.`)
    }
    const parent = parentElement?.url
      ? this.routes[slugify(parentElement.url)] || null
      : null
    if (parent) {
      url = this.normalizeChildUrl(routeElement.url, parent.path)
      transition = transition || parent?.transition || transition
    } else {
      url = this.adjustRootViewUrls(routeElement.url)
    }
    routeElement.url = url
    routeElement.transition = transition || this.transition
    const route = new Route(
      this,
      routeElement,
      routeElement.url,
      exact,
      pageTitle || parent?.pageTitle,
      routeElement.transition,
      scrollTopOffset,
      matchSetter,
      () => {
        delete this.routes[routeKey]
      },
    )
    this.routes[routeKey] = route
    return route
  }
}
