import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { slugify } from '../../services/common'
import {
  navigationState,
  onNavigationChange,
} from '../../services/navigation/state'
import {
  MatchResults,
  ROUTE_EVENTS,
} from '../../services/routing/interfaces'
import { Route } from '../../services/routing/route'
import { getPossiblePaths } from '../../services/routing/utils'

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
  styleUrl: 'view-link-list.css',
  shadow: false,
})
export class ViewLinkList {
  @Element() el!: HTMLNViewLinkListElement
  @State() route: Route | null = null
  @State() match: MatchResults | null = null
  private matchSubscription?: () => void
  private finalizeSubscription?: () => void
  @State() routes: Array<{
    active: boolean
    link: boolean
    path: string
    title: string
  }> | null = null

  /**
   * The display mode for which routes to display.
   */
  @Prop() mode: 'children' | 'parents' | 'siblings' = 'parents'

  /**
   * The string separator to put between the items.
   */
  @Prop() separator?: string

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

  async componentWillLoad() {
    if (navigationState.router) {
      this.subscribe()
    } else {
      const routerSubscription = onNavigationChange(
        'router',
        router => {
          if (router) {
            this.subscribe()
            routerSubscription()
          } else {
            this.matchSubscription?.call(this)
          }
        },
      )
    }
  }

  private subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      ({ route, match }: { route: Route; match: MatchResults }) => {
        this.route = { ...route } as Route
        this.match = match ? { ...match } : null
      },
    )
    this.route = navigationState.router?.exactRoute || null
    this.match = navigationState.router?.exactRoute?.match || null
  }

  async componentWillRender() {
    this.routes = await this.getRoutes(this.route)
  }

  private getRoutePaths(path: string) {
    switch (this.mode) {
      case 'parents':
        return getPossiblePaths(path)
    }
    return null
  }

  private async getRoutes(
    route: Route | null,
  ): Promise<Array<{
    active: boolean
    link: boolean
    path: string
    title: string
  }> | null> {
    if (route) {
      let paths =
        this.getRoutePaths(route.match?.url || route.path) || []
      if (this.excludeRoot && paths[0] == '/') paths.shift()

      let routes = await Promise.all(
        paths.map(async path => {
          const route = navigationState.router?.routes[slugify(path)]
          const resolvedPath =
            route?.match?.path.toString() || route?.path || path
          const title = (await route?.resolvedTitle()) || ''

          return {
            active: route?.match?.isExact || false,
            link: !!route,
            path: resolvedPath,
            title,
          }
        }),
      )

      routes = routes.filter(r => r.link)

      return routes || null
    }
    return null
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
            {this.routes?.map(r => [
              <li class={itemClasses}>
                {r.link ? (
                  <n-view-link
                    href={r.path}
                    exact={true}
                    activeClass={this.activeClass}
                  >
                    {r.title}
                  </n-view-link>
                ) : null}
              </li>,
              this.separator ? <li>{this.separator}</li> : null,
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
