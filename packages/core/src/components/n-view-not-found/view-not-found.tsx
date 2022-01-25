import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Prop,
} from '@stencil/core'
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
  shadow: true,
  styles: `:host { display: block; }`,
})
export class ViewNotFound {
  private initializeSubscription?: () => void
  private routeFinalizeSubscription?: () => void
  private routeMatchedSubscription?: () => void
  @Element() el!: HTMLNViewNotFoundElement

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

  componentWillLoad() {
    const { router } = routingState
    if (!router) {
      return
    }

    this.transition = this.transition || router?.transition

    this.initializeSubscription = router.eventBus.on(
      ROUTE_EVENTS.Initialized,
      () => {
        forceUpdate(this.el)
      },
    )

    this.routeMatchedSubscription = router.eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      () => {
        forceUpdate(this.el)
      },
    )

    this.routeFinalizeSubscription = router.eventBus.on(
      ROUTE_EVENTS.RouteChangeFinish,
      () => {
        forceUpdate(this.el)
      },
    )
  }

  render() {
    const hide = routingState.router?.hasExactRoute() || false
    return (
      <Host hidden={hide} class={this.transition}>
        <slot></slot>
      </Host>
    )
  }

  async componentDidRender() {
    if (!routingState.router?.hasExactRoute()) {
      await routingState.router?.setPageTags(this.pageTitle)
      routingState.router?.scrollTo(this.scrollTopOffset)
    }
  }

  disconnectedCallback() {
    this.initializeSubscription?.call(this)
    this.routeMatchedSubscription?.call(this)
    this.routeFinalizeSubscription?.call(this)
  }
}
