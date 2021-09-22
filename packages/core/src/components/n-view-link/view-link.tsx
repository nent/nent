import { Component, Element, h, Prop, State } from '@stencil/core'
import { isValue, logIf } from '../../services/common'
import { MatchResults } from '../n-views/services/interfaces'
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
  @State() location = routingState?.location

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
    this.routeSubscription = onRoutingChange('location', () => {
      this.path = routingState.router!.resolvePathname(
        this.path,
        this.parentUrl || '/',
      )

      const match = routingState.router!.matchPath({
        path: this.path,
        exact: this.exact,
        strict: this.strict,
      })

      this.match = match ? ({ ...match } as MatchResults) : null
    })
  }

  private handleClick(e: MouseEvent, path?: string) {
    if (this.match?.isExact) return
    const router = routingState.router
    if (
      !router ||
      router?.isModifiedEvent(e) ||
      !router?.history ||
      !path
    ) {
      return
    }

    e.preventDefault()
    router.goToRoute(path)
  }

  render() {
    const { router } = routingState
    const path = router?.resolvePathname(this.path, this.parentUrl)

    const match = router?.matchPath({
      path: path,
      exact: this.exact,
      strict: this.strict,
    })

    const classes = {
      [this.activeClass]: isValue(match),
      [this.linkClass || '']: true,
    }

    logIf(this.debug, 'n-view-link re-render ' + path)

    let anchorAttributes: Record<string, any> = {
      title: this.el.title,
      role: this.el.getAttribute('aria-role'),
      id: this.el.id,
    }

    return (
      <a
        href={path}
        title={this.el.title}
        {...anchorAttributes}
        n-attached-click
        class={classes}
        onClick={(e: MouseEvent) => {
          this.handleClick(e, path)
        }}
      >
        <slot></slot>
      </a>
    )
  }

  disconnectedCallback() {
    this.routeSubscription?.call(this)
  }
}
