import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Prop,
} from '@stencil/core'

import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { RouterService } from '../n-views/services/router'
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
  private routeFinalizeSubscription?: () => void
  private routeMatchedSubscription?: () => void
  private routeChangeStartSubscription?: () => void
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

  private async setPageTags(router: RouterService) {
    if (router.hasExactRoute()) return
    await router.setPageTags({
      title: this.pageTitle,
      robots: 'nofollow',
    })
    router.scrollTo(this.scrollTopOffset)
  }

  componentWillLoad() {
    const { router } = routingState
    if (!router) {
      return
    }

    this.transition = this.transition || router?.transition

    this.routeChangeStartSubscription = router.eventBus.on(
      ROUTE_EVENTS.RouteChanged,
      async () => {
        forceUpdate(this)
        await this.setPageTags(router)
      },
    )

    this.routeMatchedSubscription = router.eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      async () => {
        forceUpdate(this)
        await this.setPageTags(router)
      },
    )

    this.routeFinalizeSubscription = router.eventBus.on(
      ROUTE_EVENTS.RouteChangeFinish,
      async () => {
        await this.setPageTags(router)
        forceUpdate(this)
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

  async componentDidLoad() {
    await this.setPageTags(routingState.router!)
  }

  disconnectedCallback() {
    this.routeChangeStartSubscription?.call(this)
    this.routeMatchedSubscription?.call(this)
    this.routeFinalizeSubscription?.call(this)
  }
}
