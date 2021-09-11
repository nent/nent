import { Component, Element, h, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { debugIf } from '../../services/common'
import {
  MatchResults,
  ROUTE_EVENTS,
} from '../n-views/services/interfaces'
import {
  onRoutingChange,
  routingState,
} from '../n-views/services/state'

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
   * The class to add to the anchor tag.
   */
  @Prop() linkClass?: string

  /**
   * The class to add when the matching route is active
   * in the browser
   */
  @Prop() activeClass: string = 'active'

  /**
   * Only active on the exact href match,
   * and not on child routes
   */
  @Prop() exact: boolean = false

  /**
   * Only active on the exact href match
   * using every aspect of the URL including
   * parameters.
   */
  @Prop() strict: boolean = true

  /**
   * Provide log messages for path matching.
   */
  @Prop() debug: boolean = false

  get parentUrl() {
    return (
      this.el.closest('n-view-prompt')?.path ||
      this.el.closest('n-view')?.path
    )
  }

  componentWillLoad() {
    if (routingState.router) {
      this.subscribe()
    } else {
      const routerSubscription = onRoutingChange('router', router => {
        if (router) {
          this.subscribe()
        }
        routerSubscription()
      })
    }
  }

  private subscribe() {
    this.path = routingState.router!.resolvePathname(
      this.path,
      this.parentUrl || '/',
    )

    this.routeSubscription = eventBus.on(
      ROUTE_EVENTS.RouteChangeFinish,
      () => {
        const match = routingState.router!.matchPath({
          path: this.path,
          exact: this.exact,
          strict: this.strict,
        })

        this.match = match ? ({ ...match } as MatchResults) : null
      },
    )
    this.match = routingState.router?.matchPath({
      path: this.path,
      exact: this.exact,
      strict: this.strict,
    })
  }

  private handleClick(e: MouseEvent) {
    if (this.match?.isExact) return
    const router = routingState.router
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
      [this.linkClass || '']: true,
    }

    let anchorAttributes: Record<string, any> = {
      title: this.el.title,
      role: this.el.getAttribute('aria-role'),
      id: this.el.id,
    }

    return (
      <a
        href={this.path}
        title={this.el.title}
        {...anchorAttributes}
        n-attached-click
        class={classes}
        onClick={(e: MouseEvent) => this.handleClick(e)}
      >
        <slot />
      </a>
    )
  }
}
