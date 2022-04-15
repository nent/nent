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

export class Route implements IRoute {
  private onStartedSubscription: () => void
  private onChangedSubscription: () => void

  public completed: boolean = false
  public match: MatchResults | null = null
  public scrollOnNextRender = false
  public previousMatch: MatchResults | null = null
  public childRoutes: Route[] = []

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

  public addChildRoute(route: Route) {
    this.childRoutes = [...this.childRoutes, route].sort((a, b) =>
      a.routeElement.compareDocumentPosition(b.routeElement) &
      Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    )
  }

  public normalizeChildUrl(childUrl: string) {
    if (isAbsolute(childUrl)) return childUrl
    return this.router.normalizeChildUrl(childUrl, this.path)
  }

  public didExit() {
    return (
      !this.match?.isExact &&
      !matchesAreEqual(this.match, this.previousMatch)
    )
  }

  public get actionActivators(): HTMLNActionActivatorElement[] {
    return Array.from(
      this.routeElement.querySelectorAll('n-action-activator'),
    ).filter(e => this.isChild(e))
  }

  public isChild(element: HTMLElement) {
    const tag = this.routeElement.tagName.toLocaleLowerCase()
    return (
      element.closest(tag) == this.routeElement ||
      element.parentElement == this.routeElement ||
      element.parentElement?.closest(tag) === this.routeElement
    )
  }

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

  private toggleClass(className: string, force: boolean) {
    const exists = this.routeElement.classList.contains(className)
    if (exists && force == false)
      this.routeElement.classList.remove(className)
    if (!exists && force) this.routeElement.classList.add(className)
  }

  private adjustClasses() {
    const match = this.match != null
    const exact = this.match?.isExact || false

    this.toggleClass('active', match)
    this.toggleClass('exact', exact)
    if (this.transition) this.toggleClass(this.transition!, exact)
  }

  public captureInnerLinksAndResolveHtml(root?: HTMLElement) {
    this.router.captureInnerLinks(
      root || this.routeElement,
      this.path,
    )
    resolveChildElementXAttributes(this.routeElement)
  }

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

  public async getPreviousRoute(): Promise<Route | null> {
    const siblings = await this.getSiblingRoutes()
    const index = this.getSiblingIndex(siblings.map(r => r.route))
    let back = index > 0 ? siblings.slice(index - 1) : []
    return back[0]?.route || this.parentRoute
  }

  public isValidForNext() {
    return getChildInputValidity(this.routeElement)
  }

  public async getNextRoute(): Promise<Route | null> {
    if (this.routeElement.tagName == 'N-VIEW-PROMPT') {
      return this.parentRoute
    }
    const siblings = await this.getSiblingRoutes()
    const index = this.getSiblingIndex(siblings.map(r => r.route))
    let next = siblings.slice(index + 1)
    return next.length && next[0] ? next[0].route : this.parentRoute
  }

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

  public getParentRoute() {
    return this.parentRoute
  }

  public sortRoutes(elements: Element[]) {
    return elements.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    )
  }

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

  public getSiblingIndex(siblings: Route[]) {
    return siblings?.findIndex(p => p.path == this.path) || 0
  }

  public replaceWithRoute(path: string) {
    const route = isAbsolute(path)
      ? path
      : this.router.resolvePathname(path, this.path)

    this.router.replaceWithRoute(route)
  }

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

  public destroy() {
    this.onStartedSubscription()
    this.onChangedSubscription()
    this.routeDestroy?.call(this, this)
  }
}
