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
  @State() route: Route | null = null
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

  componentWillLoad() {
    if (routingState.router) {
      this.setupRoute()
    } else {
      const dispose = onRoutingChange('router', () => {
        this.setupRoute()
        dispose()
      })
    }
  }

  private setupRoute() {
    if (this.parentViewPrompt) {
      this.route = this.parentViewPrompt!.route.nextRoute
    } else if (this.parentView) {
      this.route = this.parentView!.route.nextRoute
    } else {
      this.subscribe()
    }
  }

  private subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      async ({ route }: { route: Route }) => {
        this.route = route.nextRoute
        this.title = await route.resolvePageTitle()
      },
    )
    this.route = routingState.router?.exactRoute?.nextRoute || null
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
        title={this.route.title}
        n-attached-click
        n-attached-key-press
      >
        {this.text || this.route.title}
      </a>
    ) : null
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
  }
}
