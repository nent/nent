import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { isValue, logIf } from '../../services/common'
import { getChildInputValidity } from '../n-view-prompt/services/elements'
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

  /**
   * Validates any current-route inputs before navigating. Disables
   * navigation if any inputs are invalid.
   */
  @Prop({
    reflect: true,
  })
  validate: boolean = false

  get parentUrl() {
    return (
      this.el.closest('n-view-prompt')?.path ||
      this.el.closest('n-view')?.path
    )
  }

  componentWillLoad() {
    this.routeSubscription = onRoutingChange('location', () => {
      if (routingState.router) {
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
      }
    })
  }

  private handleClick(e: MouseEvent | KeyboardEvent, path?: string) {
    const router = routingState.router
    if (
      router == null ||
      router.isModifiedEvent(e as MouseEvent) ||
      path == undefined
    ) {
      return true
    } else {
      e.stopImmediatePropagation()
      e.preventDefault()
      if (
        this.validate == false ||
        getChildInputValidity(router.exactRoute!.routeElement)
      ) {
        router.goToRoute(path)
      }
      return false
    }
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
      <Host>
        <a
          href={path}
          {...anchorAttributes}
          n-attached-click
          n-attached-key-press
          class={classes}
          onClick={(e: MouseEvent) => {
            return this.handleClick(e, path)
          }}
          onKeyPress={(e: KeyboardEvent) => {
            return this.handleClick(e, path)
          }}
        >
          <slot></slot>
        </a>
      </Host>
    )
  }

  disconnectedCallback() {
    this.routeSubscription?.call(this)
  }
}
