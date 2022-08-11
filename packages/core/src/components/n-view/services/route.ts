import { activateActionActivators } from '../../../services/actions/elements'
import { ActionActivationStrategy } from '../../../services/actions/interfaces'
import { PageData } from '../../../services/common'
import { logIf } from '../../../services/common/logging'
import { commonState } from '../../../services/common/state'
import { resolveChildElementXAttributes } from '../../../services/data/elements'
import {
  hasToken,
  resolveTokens,
} from '../../../services/data/tokens'
import { getChildInputValidity } from '../../n-view-prompt/services/elements'
import {
  LocationSegments,
  MatchResults,
  ROUTE_EVENTS,
} from '../../n-views/services/interfaces'
import { RouterService } from '../../n-views/services/router'
import {
  getPossibleParentPaths,
  isAbsolute,
  locationsAreEqual,
  matchesAreEqual,
} from '../../n-views/services/utils'
import { IRoute } from './interfaces'

/* It's a wrapper around a route element that provides a bunch of methods for interacting with the
route */
export class Route implements IRoute {
  private onStartedSubscription: () => void
  private onChangedSubscription: () => void

  public completed: boolean = false
  public match: MatchResults | null = null
  public scrollOnNextRender = false
  public previousMatch: MatchResults | null = null
  public childRoutes: Route[] = []

  /**
   * It creates a new route, adds it to the router, and then sets up the event listeners for the route
   * @param {RouterService} router - RouterService
   * @param {HTMLElement} routeElement - HTMLElement - the element that will be used to determine if
   * the route is active.
   * @param {string} path - The path to match against.
   * @param {Route | null} [parentRoute=null] - The parent route of this route.
   * @param {boolean} [exact=true] - boolean = true,
   * @param {PageData} pageData - PageData = {}
   * @param {string | null} [transition=null] - string | null = null,
   * @param {number} [scrollTopOffset=0] - number = 0,
   * @param matchSetter - (m: MatchResults | null) => void = () => {},
   * @param [routeDestroy] - (self: Route) => void
   */
  constructor(
    public router: RouterService,
    public routeElement: HTMLElement,
    public path: string,
    public parentRoute: Route | null = null,
    public exact: boolean = true,
    public pageData: PageData = {},
    public transition: string | null = null,
    public scrollTopOffset: number = 0,
    matchSetter: (m: MatchResults | null) => void = () => {},
    private routeDestroy?: (self: Route) => void,
  ) {
    this.router.routes.push(this)
    this.parentRoute?.addChildRoute(this)

    this.onStartedSubscription = router.eventBus.on(
      ROUTE_EVENTS.RouteChangeStart,
      async (location: LocationSegments) => {
        logIf(
          commonState.debug,
          `route: ${this.path} started -> ${location.pathname} `,
        )
        this.previousMatch = this.match
        if (!locationsAreEqual(this.router.location, location)) {
          await this.activateActions(ActionActivationStrategy.OnExit)
          this.completed = false
        }
      },
    )

    const evaluateRoute = (sendEvent: boolean = true) => {
      logIf(
        commonState.debug,
        `route: ${this.path} changed -> ${location.pathname}`,
      )
      this.match = router.matchPath(
        {
          path: this.path,
          exact: this.exact,
          strict: true,
        },
        this,
        sendEvent,
      )
      matchSetter(this.match)
      this.adjustClasses()
    }

    this.onChangedSubscription = router.eventBus.on(
      ROUTE_EVENTS.RouteChanged,
      () => {
        evaluateRoute()
      },
    )

    evaluateRoute()
  }

  /**
   * It takes a route, adds it to the childRoutes array, and then sorts the array so that the routes
   * are in the same order as they appear in the DOM
   * @param {Route} route - Route - The route to add to the child routes
   */
  public addChildRoute(route: Route) {
    this.childRoutes = [...this.childRoutes, route].sort((a, b) =>
      a.routeElement.compareDocumentPosition(b.routeElement) &
      Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    )
  }

  /**
   * If the childUrl is absolute, return it. Otherwise, return the childUrl normalized by the router
   * @param {string} childUrl - The URL to normalize.
   * @returns The normalized child url.
   */
  public normalizeChildUrl(childUrl: string) {
    if (isAbsolute(childUrl)) return childUrl
    return this.router.normalizeChildUrl(childUrl, this.path)
  }

  /**
   * If the current match is not exact and the current match is not equal to the previous match, then
   * return true
   * @returns A boolean value.
   */
  public didExit() {
    return (
      !this.match?.isExact &&
      !matchesAreEqual(this.match, this.previousMatch)
    )
  }

  /**
   * It returns an array of all the `n-action-activator` elements that are children of the `n-route`
   * element
   * @returns An array of HTMLNActionActivatorElement objects.
   */
  public get actionActivators(): HTMLNActionActivatorElement[] {
    return Array.from(
      this.routeElement.querySelectorAll('n-action-activator'),
    ).filter(e => this.isChild(e))
  }

  /**
   * It returns true if the element is a child of the route element
   * @param {HTMLElement} element - HTMLElement - The element that is being clicked
   * @returns - If the element is a child of the routeElement, it will return true.
   *   - If the element is not a child of the routeElement, it will return false.
   */
  public isChild(element: HTMLElement) {
    const tag = this.routeElement.tagName.toLocaleLowerCase()
    return (
      element.closest(tag) == this.routeElement ||
      element.parentElement == this.routeElement ||
      element.parentElement?.closest(tag) === this.routeElement
    )
  }

  /**
   * If the route matches, then capture the inner links and resolve the HTML
   */
  public async loadCompleted() {
    if (this.match) {
      this.captureInnerLinksAndResolveHtml()

      // If this is an independent route and it matches then routes have updated.
      if (this.match?.isExact) {
        this.routeElement
          .querySelectorAll('[defer-load]')
          .forEach((el: any) => {
            el.removeAttribute('defer-load')
          })

        await this.activateActions(ActionActivationStrategy.OnEnter)

        await this.adjustPageTags()
      }
    }

    this.completed = true
    this.router.routeCompleted()
  }

  /**
   * If the class exists and force is false, remove the class. If the class doesn't exist and force is
   * true, add the class
   * @param {string} className - The class name to toggle
   * @param {boolean} force - boolean - if true, the class will be added, if false, the class will be
   * removed
   */
  private toggleClass(className: string, force: boolean) {
    const exists = this.routeElement.classList.contains(className)
    if (exists && force == false)
      this.routeElement.classList.remove(className)
    if (!exists && force) this.routeElement.classList.add(className)
  }

  /**
   * If the route matches, add the `active` class, and if the route matches exactly, add the `exact`
   * class
   */
  private adjustClasses() {
    const match = this.match != null
    const exact = this.match?.isExact || false

    this.toggleClass('active', match)
    this.toggleClass('exact', exact)
    if (this.transition) this.toggleClass(this.transition!, exact)
  }

  /**
   * It captures all the inner links of the current route and resolves the HTML of the current route
   * @param {HTMLElement} [root] - The root element to search for links.
   */
  public captureInnerLinksAndResolveHtml(root?: HTMLElement) {
    this.router.captureInnerLinks(
      root || this.routeElement,
      this.path,
    )
    resolveChildElementXAttributes(this.routeElement)
  }

  /**
   * It resolves the page title by replacing any tokens in the title with the corresponding data from
   * the data store
   * @returns The title of the page.
   */
  public async resolvePageTitle() {
    let title = this.pageData.title
    if (
      commonState.dataEnabled &&
      this.pageData.title &&
      hasToken(this.pageData.title)
    ) {
      title = await resolveTokens(this.pageData.title)
    }
    return title || this.pageData.title
  }

  /**
   * It sets the page title, description, and keywords based on the page data
   */
  public async adjustPageTags() {
    const data = this.pageData
    data.title = await this.resolvePageTitle()

    if (commonState.dataEnabled) {
      if (
        !this.pageData.description &&
        hasToken(this.pageData.description!)
      ) {
        data.description = await resolveTokens(
          this.pageData.description!,
        )
      }
      if (
        !this.pageData.keywords &&
        hasToken(this.pageData.keywords!)
      ) {
        data.keywords = await resolveTokens(this.pageData.keywords!)
      }
    }
    this.router.setPageTags(data)
  }

  /**
   * "Get the previous route in the route tree."
   *
   * The function is async because it calls `getSiblingRoutes()` which is async
   * @returns The previous route in the route tree.
   */
  public async getPreviousRoute(): Promise<Route | null> {
    const siblings = await this.getSiblingRoutes()
    const index = this.getSiblingIndex(siblings.map(r => r.route))
    let back = index > 0 ? siblings.slice(index - 1) : []
    return back[0]?.route || this.parentRoute
  }

  /**
   * > If the current route element is a child of a form, return the validity of the child input
   * @returns The validity of the child input elements of the routeElement.
   */
  public isValidForNext() {
    return getChildInputValidity(this.routeElement)
  }

  /**
   * It returns the next route in the route tree
   * @returns The next route in the route stack.
   */
  public async getNextRoute(): Promise<Route | null> {
    if (this.routeElement.tagName == 'N-VIEW-PROMPT') {
      return this.parentRoute
    }
    const siblings = await this.getSiblingRoutes()
    const index = this.getSiblingIndex(siblings.map(r => r.route))
    let next = siblings.slice(index + 1)
    return next.length && next[0] ? next[0].route : this.parentRoute
  }

  /**
   * It takes the current route's path, finds all the possible parent paths, finds the routes that
   * match those paths, and then resolves the title for each of those routes
   * @returns An array of objects with the following properties:
   * - route: The route object
   * - path: The path of the route
   * - title: The title of the route
   */
  public async getParentRoutes() {
    const parents = await Promise.all(
      getPossibleParentPaths(this.path)
        .map(path => this.router.routes!.find(p => p.path == path))
        .filter(r => r)
        .map(async route => {
          const path = route?.match?.path.toString() || route?.path
          const title = await route!.resolvePageTitle()
          return {
            route,
            path,
            title,
          }
        }),
    )

    return parents
  }

  /**
   * It returns the parent route of the current route
   * @returns The parent route
   */
  public getParentRoute() {
    return this.parentRoute
  }

  /**
   * It sorts an array of DOM elements by their order in the DOM
   * @param {Element[]} elements - Element[] - An array of elements to sort.
   * @returns The elements are being sorted by their position in the DOM.
   */
  public sortRoutes(elements: Element[]) {
    return elements.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    )
  }

  /**
   * It returns a list of all the sibling routes of the current route, sorted by their order in the DOM
   * @returns An array of objects with the following properties:
   * - route: The route object
   * - path: The path of the route
   * - title: The title of the route
   */
  public async getSiblingRoutes() {
    return await Promise.all(
      (
        this.parentRoute?.childRoutes ||
        this.router.routes.filter(r => r.parentRoute == null)
      )
        .sort((a, b) =>
          a.routeElement.compareDocumentPosition(b.routeElement) &
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        )
        .map(async (route: Route) => {
          const path = route.match?.path.toString() || route.path
          const title = await route.resolvePageTitle()
          return {
            route,
            path,
            title,
          }
        }),
    )
  }

  /**
   * It returns a promise that resolves to an array of objects, each of which contains a route, a path,
   * and a title
   * @returns An array of objects with the following properties:
   * - route: the route object
   * - path: the path of the route
   * - title: the title of the route
   */
  public async getChildRoutes() {
    return await Promise.all(
      this.childRoutes
        .sort((a, b) =>
          a.routeElement.compareDocumentPosition(b.routeElement) &
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        )
        .map(async (route: Route) => {
          const path = route.match?.path.toString() || route.path
          const title = await route.resolvePageTitle()
          return {
            route,
            path,
            title,
          }
        }),
    )
  }

  /**
   * It returns the index of the current route in the array of routes passed to it
   * @param {Route[]} siblings - The array of routes that are siblings to the current route.
   * @returns The index of the current route in the array of siblings.
   */
  public getSiblingIndex(siblings: Route[]) {
    return siblings?.findIndex(p => p.path == this.path) || 0
  }

  /**
   * It takes a path and returns a route
   * @param {string} path - string
   */
  public replaceWithRoute(path: string) {
    const route = isAbsolute(path)
      ? path
      : this.router.resolvePathname(path, this.path)

    this.router.replaceWithRoute(route)
  }

  /**
   * "Activate all action activators that match the given filter."
   *
   * The function is asynchronous because it may need to wait for the DOM to be ready
   * @param {ActionActivationStrategy} forEvent - ActionActivationStrategy
   * @param filter - (
   */
  public async activateActions(
    forEvent: ActionActivationStrategy,
    filter: (
      activator: HTMLNActionActivatorElement,
    ) => boolean = _a => true,
  ) {
    await activateActionActivators(
      this.actionActivators,
      forEvent,
      filter,
    )
  }

  /**
   * It unsubscribes from the event listeners.
   */
  public destroy() {
    this.onStartedSubscription()
    this.onChangedSubscription()
    this.routeDestroy?.call(this, this)
  }
}
