import { Component, Element, h, Prop, State } from '@stencil/core'
import { MatchResults } from '../n-views/services/interfaces'
import {
  onRoutingChange,
  routingState,
} from '../n-views/services/state'
import { Path } from '../n-views/services/utils/path-regex'

/**
 * @slot active - content to display when route match
 * @slot inactive - content to display when no route match
 */
@Component({
  tag: 'n-view-detect',
  shadow: true,
})
export class ViewDetect {
  private routeSubscription!: () => void
  @State() match?: MatchResults | null
  @Element() el!: HTMLNViewDetectElement
  /**
   * The route that will toggle the active slot of this component
   */
  @Prop({ mutable: true }) route!: string
  /**
   * Optional Regex value to route match on
   */
  @Prop({ mutable: true }) routeMatch?: Path
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

  get parentUrl() {
    return (
      this.el.closest('n-view-prompt')?.path ||
      this.el.closest('n-view')?.path
    )
  }

  private checkRoutingState() {
    if (!routingState || !routingState.router) return

    this.route = routingState.router!.resolvePathname(
      this.route,
      this.parentUrl || '/',
    )

    if (this.routeMatch) {
      this.routeMatch = new RegExp(
        this.routeMatch as string,
        !this.strict ? 'i' : undefined,
      )
    }

    const match = routingState.router!.matchPath({
      path: this.routeMatch != null ? this.routeMatch : this.route,
      exact: this.exact,
      strict: this.strict,
    })

    this.match = match ? ({ ...match } as MatchResults) : null
  }

  componentWillLoad() {
    this.checkRoutingState()

    this.routeSubscription = onRoutingChange('location', () => {
      this.checkRoutingState()
    })
  }

  render() {
    return this.match ? (
      <slot name="active"></slot>
    ) : (
      <slot name="inactive"></slot>
    )
  }

  disconnectedCallback() {
    this.routeSubscription?.call(this)
  }
}
