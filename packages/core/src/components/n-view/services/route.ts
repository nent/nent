import { activateActionActivators } from '../../../services/actions/elements'
import { ActionActivationStrategy } from '../../../services/actions/interfaces'
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
  RouteViewOptions,
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
    public pageTitle: string = '',
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

    const evaluateRoute = () => {
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
    let routeViewOptions: RouteViewOptions = {}

    if (this.match) {
      this.captureInnerLinksAndResolveHtml()

      // If this is an independent route and it matches then routes have updated.
      if (
        this.match?.isExact &&
        !matchesAreEqual(this.match, this.previousMatch)
      ) {
        this.routeElement
          .querySelectorAll('[defer-load]')
          .forEach((el: any) => {
            el.removeAttribute('defer-load')
          })

        // If the only change to location is a hash change then do not scroll.
        if (
          this.router.history &&
          this.router.history.location.hash
        ) {
          routeViewOptions = {
            scrollToId: this.router.history.location.hash.slice(1),
          }
        } else if (this.scrollTopOffset) {
          routeViewOptions = {
            scrollTopOffset: this.scrollTopOffset,
          }
        }

        await this.activateActions(ActionActivationStrategy.OnEnter)
        await this.adjustTitle()
      }
    }

    this.completed = true

    this.router.viewsUpdated(routeViewOptions)
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
  }

  public captureInnerLinksAndResolveHtml(root?: HTMLElement) {
    this.router.captureInnerLinks(
      root || this.routeElement,
      this.path,
    )
    resolveChildElementXAttributes(this.routeElement)
  }

  public async resolvedTitle() {
    if (!this.pageTitle) return ''
    if (commonState.dataEnabled) {
      if (hasToken(this.pageTitle)) {
        return (this._title = await resolveTokens(this.pageTitle))
      }
    }
    return this.pageTitle
  }

  private _title?: string
  public get title() {
    return this._title || this.pageTitle
  }

  public async adjustTitle() {
    let pageTitle = (this._title = await this.resolvedTitle())
    this.router.adjustTitle(pageTitle)
  }

  public goBack() {
    const back = this.previousRoute
    if (back) this.router.goToRoute(back.path)
    else if (this.router.history.previousLocation)
      this.router.history.goBack()
    else this.goToParentRoute()
  }

  public goNext() {
    const valid = getChildInputValidity(this.routeElement)
    if (valid) {
      const next = this.nextRoute
      if (next) this.router.goToRoute(next.path)
      else this.goToParentRoute()
    }
  }

  public get previousRoute(): Route | null {
    const siblings = this.getSiblingRoutes()
    let back =
      this.siblingIndex > 0
        ? siblings.slice(this.siblingIndex - 1)
        : []
    return back[0] || this.parentRoute
  }

  public get nextRoute(): Route | null {
    if (this.routeElement.tagName == 'N-VIEW-PROMPT') {
      return this.parentRoute
    }
    const siblings = this.getSiblingRoutes()
    let next = siblings.slice(this.siblingIndex + 1)
    return next[0] || this.parentRoute
  }

  public async getParentRoutes() {
    const parents = await Promise.all(
      getPossibleParentPaths(this.path)
        .map(path => this.router.routes!.find(p => p.path == path))
        .filter(r => r)
        .map(async route => {
          const resolvedPath =
            route?.match?.path.toString() || route?.path
          const title = (await route?.resolvedTitle()) || ''
          return Object.assign({}, route, {
            path: resolvedPath,
            title,
          })
        }),
    )

    return parents
  }

  public goToParentRoute() {
    if (this.parentRoute) {
      this.goToRoute(this.parentRoute.path)
    } else {
      this.router.goToParentRoute()
    }
  }

  public getSiblingRoutes() {
    const siblings =
      this.parentRoute?.childRoutes ||
      this.router.routes
        .filter(r => r.parentRoute == null)
        .sort((a, b) =>
          a.routeElement.compareDocumentPosition(b.routeElement) &
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        )
    return siblings
  }

  public get siblingIndex() {
    const siblings = this.getSiblingRoutes()
    return siblings?.findIndex(p => p.path == this.path) || 0
  }

  public goToRoute(path: string) {
    const route = isAbsolute(path)
      ? path
      : this.router.resolvePathname(path, this.path)
    this.router.goToRoute(route)
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
