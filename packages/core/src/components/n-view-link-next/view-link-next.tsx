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

  private get parentView() {
    return this.el.closest('n-view')
  }

  private get parentViewPrompt() {
    return this.el.closest('n-view-prompt')
  }

  componentWillLoad() {
    if (navigationState.router) {
      this.setupRoute()
    } else {
      const dispose = eventBus.on(ROUTE_EVENTS.RouteFinalized, () => {
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

  private subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      async ({ route }: { route: Route }) => {
        this.route = route.nextRoute
        this.title = await route.resolvedTitle()
      },
    )
    this.route = navigationState.router?.exactRoute?.nextRoute || null
  }

  render() {
    return (
      <Host>
        {this.route ? (
          <a
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
        ) : null}
      </Host>
    )
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
  }
}
