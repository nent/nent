import { Component, Element, h, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { Route } from '../n-view/services/route'
import {
  MatchResults,
  ROUTE_EVENTS,
} from '../n-views/services/interfaces'
import {
  onRoutingChange,
  routingState,
} from '../n-views/services/state'

/**
 * Display a list of routes related to the current route.
 * Modes:
 * **siblings**: all routes at the same depth level (nav)
 * **parents**: all parent routes. (breadcrumbs)
 * **children**: all child routes within a hierarchy. (sub-menu)
 *
 * @system routing
 */
@Component({
  tag: 'n-view-link-list',
  shadow: false,
})
export class ViewLinkList {
  @Element() el!: HTMLNViewLinkListElement
  @State() route: Route | null = null
  @State() match: MatchResults | null = null
  private matchSubscription?: () => void
  @State() routes: Array<{
    route?: Route
    path?: string
    title?: string
  }> = []

  /**
   * The display mode for which routes to display.
   */
  @Prop() mode: 'children' | 'parents' | 'siblings' = 'parents'

  /**
   * The active-class to use with the n-view-link elements.
   */
  @Prop() activeClass?: string = 'active'

  /**
   * The class to add to the anchor tag.
   */
  @Prop() linkClass?: string = ''

  /**
   * The list-class to use with the UL tag
   */
  @Prop() listClass?: string = ''

  /**
   * The list-item-class to use with the li tag
   */
  @Prop() itemClass?: string = ''

  /**
   * Specify if the '/' route should
   * be skipped in the list.
   */
  @Prop() excludeRoot: boolean = false

  private get parentView() {
    return this.el.closest('n-view')
  }

  private get parentViewPrompt() {
    return this.el.closest('n-view-prompt')
  }

  componentWillLoad() {
    if (routingState.router) {
      this.setupRoute()
    } else {
      const dispose = onRoutingChange('router', () => {
        this.setupRoute()
        dispose()
      })
    }
  }

  get inView() {
    return this.parentView != null || this.parentViewPrompt != null
  }

  private setupRoute() {
    if (this.parentViewPrompt) {
      this.route = this.parentViewPrompt?.route || null
    } else if (this.parentView) {
      this.route = this.parentView?.route || null
    }

    if (this.route == null) this.subscribe()
  }

  private subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      ({ route, match }: { route: Route; match: MatchResults }) => {
        this.route = route
        this.match = match
        if (this.inView) {
          this.matchSubscription!.call(this)
        }
      },
    )

    this.route = routingState.router?.exactRoute || null
    this.match = routingState.router?.exactRoute?.match || null
  }

  async componentWillRender() {
    let routes = await this.getRoutes()
    if (this.mode == 'parents' && routes?.length && this.excludeRoot)
      routes.shift()

    this.routes = routes || []
  }

  private async getRoutes() {
    switch (this.mode) {
      case 'parents':
        return await this.route?.getParentRoutes()
      case 'siblings':
        return await this.route?.getSiblingRoutes()
      case 'children':
        return await this.route?.getChildRoutes()
    }
  }

  private getUrl(route: Route) {
    let url = route.match?.url || route.path
    if (this.match) {
      Object.keys(this.match?.params).forEach(param => {
        url = url.replace(`:${param}`, this.match!.params[param])
      })
    }

    return url
  }

  render() {
    return (
      <ul class={this.listClass}>
        {this.routes?.map((r: any) => [
          <li class={this.itemClass}>
            <n-view-link
              path={this.getUrl(r.route)}
              exact={true}
              link-class={this.linkClass}
              active-class={this.activeClass}
            >
              {r.title}
            </n-view-link>
          </li>,
        ])}
      </ul>
    )
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
  }
}
