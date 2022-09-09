import { RafCallback } from '@stencil/core'
import {
  IEventEmitter,
  PageData,
} from '../../../services/common/interfaces'
import { warn } from '../../../services/common/logging'
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

/* The RouterService is responsible for managing the browser history and the routes that are registered
with the router */
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
  /**
   * It creates a new instance of the NavigationService class
   * @param {Window} win - Window - the window object
   * @param writeTask - (t: RafCallback) => void
   * @param {IEventEmitter} eventBus - IEventEmitter - this is the event bus that the router uses to
   * communicate with the rest of the application.
   * @param {IEventEmitter} actions - IEventEmitter - this is the actions object that is passed to the
   * app.
   * @param {string} [root] - The root of the application.
   * @param {string} [appTitle] - The title of the app.
   * @param {string} [appDescription] - string = '',
   * @param {string} [appKeywords] - string = '',
   * @param {string} [transition] - string = '',
   * @param [scrollTopOffset=0] - This is the number of pixels from the top of the page that the
   * browser should scroll to when a new page is loaded.
   */
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

  /**
   * It adds three data providers to the data provider registry
   */
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

  /**
   * It takes a path and returns a path with a leading slash
   * @param {string} path - The path to be adjusted.
   * @returns The path with the root removed.
   */
  public adjustRootViewUrls(path: string): string {
    let stripped =
      this.root && hasBasename(path, this.root)
        ? path.slice(this.root.length)
        : path
    if (isFilename(this.root)) {
      return '#' + addLeadingSlash(stripped)
    }
    return addLeadingSlash(stripped)
  }

  /**
   * If the current location is the root, or if the current location is the root, return true
   * @returns The pathname of the current location.
   */
  public atRoot() {
    return (
      this.location?.pathname == this.root ||
      this.location.pathname == '/'
    )
  }

  /**
   * It initializes the router by setting the startUrl, replacing the current route with the startUrl
   * if the startUrl is at the root, capturing inner links, notifying the listener that the router has
   * been initialized, and calling allRoutesComplete if all routes are complete
   * @param {string} [startUrl] - The URL that the router should start at.
   */
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

  /**
   * If the route is not found, set the page title to "Not found" and the robots meta tag to "nofollow"
   */
  private allRoutesComplete() {
    //if (!this.hasExactRoute()) {
    //  this.setPageTags({
    //    title: 'Not found',
    //    robots: 'nofollow',
    //  })
    //}
    this.listener.notifyRouteFinalized(this.location)
  }

  /**
   * If all routes are completed, then call the allRoutesComplete function
   */
  public routeCompleted() {
    if (this.routes.every(r => r.completed)) {
      this.allRoutesComplete()
    }
  }

  /**
   * If the current route has a next route, go to that route. Otherwise, go back in the browser history
   * @returns the previous location pathname.
   */
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

  /**
   * If the current route is valid, then go to the next route, otherwise go to the parent route
   * @returns The next route
   */
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

  /**
   * If the current route has a parent route, go to that parent route. Otherwise, go to the parent
   * route of the current route
   * @returns The parent route of the current route.
   */
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

  /**
   * If the history has a stored scroll position, scroll to that position. Otherwise, scroll to the top
   * of the page
   * @param {number} scrollOffset - number
   */
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

  /**
   * It takes an id, finds the element with that id, and scrolls it into view
   * @param {string} id - The id of the element to scroll to.
   */
  public scrollToId(id: string) {
    this.writeTask(() => {
      const elm = this.win.document.querySelector('#' + id)
      elm?.scrollIntoView()
    })
  }

  /**
   * It takes a path, resolves it, and pushes it to the history
   * @param {string} path - The path to navigate to.
   */
  public goToRoute(path: string) {
    this.listener.notifyRouteChangeStarted(path)
    const pathName = resolvePathname(path, this.location.pathname)
    this.history.push(pathName)
  }

  /**
   * It replaces the current route with the new route
   * @param {string} path - The path to navigate to.
   */
  public replaceWithRoute(path: string) {
    this.listener.notifyRouteChangeStarted(path)
    const pathName = resolvePathname(path, this.location.pathname)
    this.history.replace(pathName)
  }

  /**
   * `matchPath` is a function that returns a `MatchResults` object if the current location matches the
   * given `options` and `route` (if given)
   * @param {MatchOptions} options - MatchOptions = {}
   * @param {Route | null} [route=null] - The route to match against.
   * @param {boolean} [sendEvent=true] - boolean = true
   * @returns A MatchResults object.
   */
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

  /**
   * It takes a path and a parent path, and returns a path that is relative to the parent path
   * @param {string} path - The path to resolve.
   * @param {string} [parentPath] - The path of the parent route.
   * @returns The pathname of the current location.
   */
  public resolvePathname(path: string, parentPath?: string) {
    return resolvePathname(path, parentPath || this.location.pathname)
  }

  /**
   * If the childUrl is a relative path, then it will be appended to the parentUrl
   * @param {string} childUrl - The URL of the child route.
   * @param {string} parentUrl - The URL of the parent route.
   * @returns The childUrl with the parentUrl as the basename.
   */
  public normalizeChildUrl(childUrl: string, parentUrl: string) {
    return ensureBasename(childUrl, parentUrl)
  }

  /**
   * If the event is modified, return true.
   * @param {MouseEvent} ev - MouseEvent - The event object that was passed to the event handler.
   * @returns A boolean value.
   */
  public isModifiedEvent(ev: MouseEvent) {
    return ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey
  }

  /**
   * It sets the page title, description, keywords, and robots meta tags, and scrolls to the top of the
   * page
   * @param {PageData} pageData - PageData
   */
  public async setPageTags(pageData: PageData) {
    const { title, description, keywords, robots } = pageData
    if (this.win.document) {
      this.win.document.title = [title, this.appTitle]
        .filter(v => v)
        .join(' | ')

      const robotElement = this.win.document.querySelector('meta[name=robots]')
      if (robots && robotElement) {
        robotElement.content = robots
      }
      
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

  /**
   * It captures all the links in the root element and calls the `handleRouteLinkClick` function when a
   * link is clicked
   * @param {HTMLElement} root - HTMLElement - The root element to search for links in.
   * @param {string} [fromPath] - The path from which the link was clicked.
   */
  public captureInnerLinks(root: HTMLElement, fromPath?: string) {
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

  /**
   * It returns all the routes that have a match property that is exact
   * @returns The exact routes
   */
  public get exactRoutes() {
    return this.routes.filter(r => r.match?.isExact)
  }

  /**
   * It returns an array of all the routes that have a match property that is true
   * @returns An array of all the routes that matched the current path.
   */
  public get matchedRoutes() {
    return this.routes.filter(r => r.match)
  }

  /**
   * If the length of the routes array is greater than 0, return true. Otherwise, return false
   * @returns The length of the routes array.
   */
  public get hasRoutes() {
    return this.routes.length > 0
  }

  /**
   * It returns true if the exactRoutes array has at least one item in it
   * @returns The length of the array of exact routes.
   */
  public hasExactRoute() {
    return this.exactRoutes?.length > 0
  }

  /**
   * If the route has an exact route, return the first exact route. Otherwise, return null
   * @returns The first exact route in the array of exact routes.
   */
  public get exactRoute() {
    if (this.hasExactRoute()) return this.exactRoutes[0]
    return null
  }

  /**
   * If the route is an absolute path, then go to that route. If the route is a relative path, then
   * normalize the route and go to that route
   * @param {string} toPath - The path to navigate to.
   * @param {string} [fromPath] - The current path.
   * @returns the route.
   */
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

  /**
   * It removes the event listener, destroys the history object, and destroys each route
   */
  public destroy() {
    this.removeHandler()
    this.listener.destroy()
    this.history.destroy()
    this.routes.forEach(r => r.destroy())
  }

  /**
   * It creates a new Route object and adds it to the list of routes
   * @param {HTMLNViewElement | HTMLNViewPromptElement} routeElement - The element that is being used
   * to create the route.
   * @param {HTMLNViewElement | null} parentElement - The parent route element.
   * @param matchSetter - (m: MatchResults | null) => void
   * @returns A new Route object.
   */
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
