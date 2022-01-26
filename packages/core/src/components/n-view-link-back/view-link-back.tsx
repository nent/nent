import { Component, Element, h, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { Route } from '../n-view/services/route'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import {
  onRoutingChange,
  routingState,
} from '../n-views/services/state'

/**
 *
 * @system routing
 */
@Component({
  tag: 'n-view-link-back',
  styles: 'n-view-link-back { display: inline-block; }',
  shadow: false,
})
export class ViewLinkBack {
  private matchSubscription?: () => void
  @Element() el!: HTMLNViewLinkBackElement
  @State() route: Route | null | undefined = null
  @State() title?: string

  /**
   * The link text
   */
  @Prop() text?: string

  /**
   * The class to add to the anchor tag.
   */
  @Prop() linkClass?: string

  private get parentView() {
    return this.el.closest('n-view')
  }
  private get parentViewPrompt() {
    return this.el.closest('n-view-prompt')
  }

  async componentWillLoad() {
    if (routingState.router) {
      await this.setupRoute()
    } else {
      const dispose = onRoutingChange('router', async () => {
        await this.setupRoute()
        dispose()
      })
    }
  }

  private async setupRoute() {
    if (this.parentViewPrompt) {
      this.route =
        await this.parentViewPrompt!.route.getPreviousRoute()
    } else if (this.parentView) {
      this.route = await this.parentView!.route.getPreviousRoute()
    } else {
      this.subscribe()
    }
  }

  private async subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      async ({ route }: { route: Route }) => {
        this.route = await route.getPreviousRoute()
        this.title = await route.resolvePageTitle()
      },
    )
    this.route =
      await routingState.router?.exactRoute?.getPreviousRoute()
  }

  render() {
    return this.route ? (
      <a
        class={this.linkClass}
        onClick={e => {
          e.preventDefault()
          this.route?.goToRoute(this.route.path)
        }}
        onKeyPress={e => {
          e.preventDefault()
          this.route?.goToRoute(this.route.path)
        }}
        href={this.route.path}
        title={this.title || this.route.pageTitle}
        n-attached-click
        n-attached-key-press
      >
        {this.text || this.title || this.route.pageTitle}
      </a>
    ) : null
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
  }
}
