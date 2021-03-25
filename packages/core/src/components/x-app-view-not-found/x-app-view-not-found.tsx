import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { ROUTE_EVENTS } from '../../services/routing/interfaces'
import { RouterService } from '../../services/routing/router'

/**
 * This component should be placed at the end of the content,
 * inside the x-app component. It shows up when no views
 * above it resolve.
 *
 * @system routing
 */
@Component({
  tag: 'x-app-view-not-found',
  shadow: false,
  styles: `x-app-view-not-found { display: block; }`,
})
export class XAppViewNotFound {
  private finalizeSubscription!: () => void
  private routeFinalizeSubscription!: () => void
  private exactMatchedSubscription!: () => void
  @Element() el!: HTMLXAppViewNotFoundElement
  @State() show: boolean = false

  /**
   * The router-service instance  (internal)
   *
   */
  @Prop({ mutable: true }) router!: RouterService

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-app
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
  @Prop() transition?: string

  private get routeContainer() {
    return this.el.closest('x-app')
  }

  private async setupView() {
    if (!this.router.hasRoutes) {
      this.show = true
      return
    }
    this.show = !this.router.hasExactRoute()
  }

  async componentWillLoad() {
    if (!this.routeContainer?.router) {
      return
    }
    this.router = this.routeContainer.router

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
      this.router.viewsUpdated({
        scrollTopOffset: this.scrollTopOffset,
      })
      await this.router.adjustTitle(this.pageTitle)
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
