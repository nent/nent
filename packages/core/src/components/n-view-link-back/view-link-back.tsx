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
import { Route } from '../n-views/services/route'
import {
  navigationState,
  onNavigationChange,
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
  @State() route: Route | null = null
  @State() title?: string

  /**
   * The link text
   */
  @Prop() text?: string

  private get parentView() {
    return this.el.closest('n-view')
  }
  private get parentViewPrompt() {
    return this.el.closest('n-view-prompt')
  }

  componentWillLoad() {
    const dispose = eventBus.on(
      ROUTE_EVENTS.Initialized,
      async () => {
        await this.setupRoute()
        dispose()
      },
    )
  }

  private async setupRoute() {
    if (this.parentViewPrompt) {
      this.route = this.parentViewPrompt!.route.previousRoute
    } else if (this.parentView) {
      this.route = this.parentView!.route.previousRoute
    } else if (navigationState.router) {
      this.subscribe()
    } else {
      const routerSubscription = onNavigationChange(
        'router',
        async router => {
          if (router) {
            await this.subscribe()
            routerSubscription()
          }
        },
      )
    }
  }

  private async subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      async ({ route }: { route: Route }) => {
        this.route = route.previousRoute
        this.title = await route.resolvedTitle()
      },
    )
    this.route =
      navigationState.router?.exactRoute?.previousRoute || null
  }

  async componentWillRender() {}

  render() {
    return (
      <Host>
        {this.route ? (
          <a href={this.route.path} title={this.route.title}>
            {this.text || this.route.title}
          </a>
        ) : null}
      </Host>
    )
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
  }
}
