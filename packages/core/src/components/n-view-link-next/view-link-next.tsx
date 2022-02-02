import { Component, Element, h, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { Route } from '../n-view/services/route'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import {
  onRoutingChange,
  routingState,
} from '../n-views/services/state'

/**
 * This element will automatically go to the next
 * view in the view.
 * @system routing
 */
@Component({
  tag: 'n-view-link-next',
  styles: 'n-view-link-next { display: inline-block; }',
  shadow: false,
})
export class ViewLinkNext {
  private matchSubscription?: () => void
  @Element() el!: HTMLNViewLinkNextElement
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
      this.setPage(this.parentViewPrompt!.route)
    } else if (this.parentView) {
      this.setPage(this.parentView!.route)
    } else {
      await this.subscribe()
    }
  }

  private async setPage(route: Route) {
    this.route = await route.getNextRoute()
    this.title = await this.route?.resolvePageTitle()
  }

  private async subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      async ({ route }: { route: Route }) => {
        await this.setPage(route)
      },
    )
    if (routingState.router?.exactRoute)
      await this.setPage(routingState.router?.exactRoute)
  }

  render() {
    const text = this.text || this.title
    return (
      <n-view-link
        link-class={this.linkClass}
        path={this.route?.path || ''}
        title={this.title}
        active-class="none"
      >
        <slot name="start"></slot>
        {text ? text : <slot />}
        <slot name="end"></slot>
      </n-view-link>
    )
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
  }
}
