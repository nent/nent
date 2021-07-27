import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'

/**
 * This element should be placed at the end of the content,
 * inside the n-views element. It shows up when no views
 * above it resolve.
 *
 * @system routing
 */
@Component({
  tag: 'n-view-not-found',
  shadow: false,
  styles: `n-view-not-found { display: block; }`,
})
export class ViewNotFound {
  private finalizeSubscription!: () => void
  private routeFinalizeSubscription!: () => void
  private exactMatchedSubscription!: () => void
  @Element() el!: HTMLNViewNotFoundElement
  @State() show: boolean = false

  /**
   * The title for this view. This is prefixed
   * before the app title configured in n-views
   *
   */
  @Prop() pageTitle = 'Not Found'

  /**
   * Header height or offset for scroll-top on this
   * view.
   */
  @Prop() scrollTopOffset = 0

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop({ mutable: true }) transition?: string

  private async setupView() {
    if (!routingState.router?.hasRoutes) {
      this.show = true
      this.transition =
        this.transition || routingState.router?.transition
      return
    }
    this.show = !routingState.router.hasExactRoute()
  }

  async componentWillLoad() {
    this.finalizeSubscription = eventBus.on(
      ROUTE_EVENTS.Initialized,
      async () => {
        await this.setupView()
      },
    )

    this.routeFinalizeSubscription = eventBus.on(
      ROUTE_EVENTS.RouteFinalized,
      async () => {
        await this.setupView()
      },
    )

    this.exactMatchedSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      async () => {
        this.show = false
      },
    )
  }

  async componentDidRender() {
    if (this.show) {
      routingState.router?.viewsUpdated({
        scrollTopOffset: this.scrollTopOffset,
      })
      await routingState.router?.adjustTitle(this.pageTitle)
    }
  }

  disconnectedCallback() {
    this.finalizeSubscription?.call(this)
    this.routeFinalizeSubscription?.call(this)
    this.exactMatchedSubscription?.call(this)
  }

  render() {
    return (
      <Host hidden={!this.show} class={this.transition}>
        <slot />
      </Host>
    )
  }
}
