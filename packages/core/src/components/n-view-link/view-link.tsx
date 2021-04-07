import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { debugIf } from '../../services/common'
import {
  navigationState,
  onNavigationChange,
} from '../../services/navigation/state'
import {
  MatchResults,
  ROUTE_EVENTS,
} from '../../services/routing/interfaces'

/**
 * The element should be used in-place of an `a` tag to navigate without
 * refreshing the page. This element supports an active-class that will
 * be applied when the route in **href** matches the route of the app.
 *
 * This is helpful for displaying active routes in menus, bread-crumbs and tabs.
 *
 * @system routing
 */
@Component({
  tag: 'n-view-link',
  styleUrl: `view-link.css`,
  shadow: false,
})
export class ViewLink {
  private routeSubscription!: () => void
  @Element() el!: HTMLNViewLinkElement
  @State() match?: MatchResults | null

  /**
   * The destination route for this link
   */
  @Prop({ mutable: true }) path!: string

  /**
   * The class to add when the matching route is active
   * in the browser
   */
  @Prop() activeClass = 'active'

  /**
   * Only active on the exact href match,
   * and not on child routes
   */
  @Prop() exact = false

  /**
   * Only active on the exact href match
   * using every aspect of the URL including
   * parameters.
   */
  @Prop() strict = true

  /**
   * Provide log messages for path matching.
   */
  @Prop() debug = false

  get parentUrl() {
    return (
      this.el.closest('n-view-prompt')?.path ||
      this.el.closest('n-view')?.path
    )
  }

  componentWillLoad() {
    if (navigationState.router) {
      this.subscribe()
    } else {
      const routerSubscription = onNavigationChange(
        'router',
        router => {
          if (router) {
            this.subscribe()
            routerSubscription()
          }
        },
      )
    }
  }

  private subscribe() {
    this.path = navigationState.router!.resolvePathname(
      this.path,
      this.parentUrl || '/',
    )

    this.routeSubscription = eventBus.on(
      ROUTE_EVENTS.RouteFinalized,
      () => {
        const match = navigationState.router!.matchPath({
          path: this.path,
          exact: this.exact,
          strict: this.strict,
        })

        this.match = match ? ({ ...match } as MatchResults) : null
      },
    )
    this.match = navigationState.router?.matchPath({
      path: this.path,
      exact: this.exact,
      strict: this.strict,
    })
  }

  private handleClick(e: MouseEvent) {
    if (this.match?.isExact) return
    const router = navigationState.router
    if (
      !router ||
      router?.isModifiedEvent(e) ||
      !router?.history ||
      !this.path
    ) {
      return
    }

    e.preventDefault()
    router.goToRoute(this.path)
  }

  disconnectedCallback() {
    this.routeSubscription?.call(this)
  }

  render() {
    debugIf(
      this.debug,
      `n-view-link: ${this.path} matched: ${this.match != null}`,
    )

    const classes = {
      [this.activeClass]: this.match !== null,
    }

    let anchorAttributes: Record<string, any> = {
      title: this.el.title,
      role: this.el.getAttribute('aria-role'),
      id: this.el.id,
    }

    return (
      <Host onClick={(e: MouseEvent) => this.handleClick(e)}>
        <a
          href={this.path}
          title={this.el.title}
          {...anchorAttributes}
          n-attached-click
          class={classes}
          onClick={(e: MouseEvent) => e.preventDefault()}
        >
          <slot />
        </a>
      </Host>
    )
  }
}
