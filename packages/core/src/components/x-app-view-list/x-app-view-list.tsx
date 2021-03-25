import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { isValue } from '../../services/common'
import {
  getPossiblePaths,
  MatchResults,
  Route,
  ROUTE_EVENTS,
} from '../../services/routing'
import { RouterService } from '../../services/routing/router'

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
  tag: 'x-app-view-list',
  styleUrl: 'x-app-view-list.css',
  shadow: false,
})
export class XAppViewList {
  @Element() el!: HTMLXAppViewListElement
  @State() route: Route | null = null
  private matchSubscription?: () => void
  @State() routes: Array<{
    active: boolean
    link: boolean
    path: string
    title: string
  }> | null = null

  /**
   * The router-service instance  (internal)
   */
  @Prop({ mutable: true }) router?: RouterService

  /**
   * The display mode for which routes to display.
   */
  @Prop() mode: 'children' | 'parents' | 'siblings' = 'parents'

  /**
   * The string separator to put between the items.
   */
  @Prop() separator?: string

  /**
   * The active-class to use with the x-app-link components.
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

  private get routeContainer(): HTMLXAppElement | null {
    return this.el.closest('x-app')
  }

  async componentWillLoad() {
    this.router = this.routeContainer?.router
    if (this.router) {
      this.matchSubscription = eventBus.on(
        ROUTE_EVENTS.RouteMatchedExact,
        async ({ route }: { route: Route; match: MatchResults }) => {
          this.route = { ...route } as Route
        },
      )
    }
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
      let paths = this.getRoutePaths(route.path) || []
      if (this.excludeRoot && paths[0] == '/') paths.shift()

      let routes = await Promise.all(
        paths.map(async path => {
          const route = this.router?.routes[path]
          const resolvedPath =
            route?.match?.path.toString() || route?.path || path
          const title = (await route?.resolvedTitle()) || ''

          return {
            active: route?.match?.isExact || false,
            link: isValue(route),
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
                  <x-app-link
                    href={r.path}
                    exact={true}
                    activeClass={this.activeClass}
                  >
                    {r.title}
                  </x-app-link>
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
  }
}
