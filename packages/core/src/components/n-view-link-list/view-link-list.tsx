import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
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
  styles: 'n-view-link-list { display: block; }',
  shadow: false,
})
export class ViewLinkList {
  @Element() el!: HTMLNViewLinkListElement
  @State() route: Route | null = null
  @State() match: MatchResults | null = null
  private matchSubscription?: () => void
  private finalizeSubscription?: () => void
  @State() routes: Route[] | any[] = []

  /**
   * The display mode for which routes to display.
   */
  @Prop() mode: 'children' | 'parents' | 'siblings' = 'parents'

  /**
   * The active-class to use with the n-view-link components.
   */
  @Prop() activeClass?: string

  /**
   * The list-class to use with the UL tag
   */
  @Prop() listClass?: string

  /**
   * The list-item-class to use with the li tag
   */
  @Prop() itemClass?: string

  /**
   * Specify if the '/' route should
   * be skipped in the list.
   */
  @Prop() excludeRoot: boolean = false

  componentWillLoad() {
    if (routingState.router) {
      const dispose = eventBus.on(ROUTE_EVENTS.Initialized, () => {
        this.subscribe()
        dispose()
      })
    } else {
      const routerSubscription = onRoutingChange('router', router => {
        if (router) {
          this.subscribe()
          routerSubscription()
        } else {
          this.matchSubscription?.call(this)
        }
      })
    }
  }

  private subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      ({ route, match }: { route: Route; match: MatchResults }) => {
        this.route = route
        this.match = match
      },
    )

    this.route = routingState.router?.exactRoute || null
    this.match = routingState.router?.exactRoute?.match || null
  }

  async componentWillRender() {
    let routes = (await this.getRoutes()) || []
    if (this.excludeRoot && routes[0]?.path == '/') routes.shift()

    this.routes = routes
  }

  private async getRoutes() {
    switch (this.mode) {
      case 'parents':
        return (await this.route?.getParentRoutes()) || null
      case 'siblings':
        return this.route?.getSiblingRoutes() || null
      case 'children':
        return this.route?.childRoutes || null
    }
  }

  private getUrl(route: any) {
    let url = route.match?.url || route.path
    if (this.match) {
      Object.keys(this.match?.params).forEach(param => {
        url = url.replace(`:${param}`, this.match!.params[param])
      })
    }

    return url
  }

  render() {
    const itemClasses: any = {
      [this.itemClass || '']: true,
      [this.activeClass || '']: true,
    }

    return (
      <Host>
        {this.routes ? (
          <ol class={this.listClass}>
            {this.routes?.map((r: any) => [
              <li class={itemClasses}>
                <n-view-link
                  path={this.getUrl(r)}
                  exact={true}
                  activeClass={this.activeClass}
                >
                  {r.title}
                </n-view-link>
              </li>,
            ])}
          </ol>
        ) : null}
      </Host>
    )
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
    this.finalizeSubscription?.call(this)
  }
}
