import { Component, Element, h, Host, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import {
  MatchResults,
  ROUTE_EVENTS,
} from '../n-views/services/interfaces'
import { Route } from '../n-views/services/route'
import {
  navigationState,
  onNavigationChange,
} from '../n-views/services/state'

@Component({
  tag: 'n-view-link-next',
  styles: 'n-view-link-next { display: inline-block; }',
  shadow: false,
})
export class NViewLinkNext {
  @Element() el!: HTMLNViewLinkNextElement
  @State() route: Route | null = null
  @State() next: Route | null = null
  @State() match: MatchResults | null = null
  private matchSubscription?: () => void
  private finalizeSubscription?: () => void

  async componentWillLoad() {
    if (navigationState.router) {
      this.subscribe()
    } else {
      const routerSubscription = onNavigationChange(
        'router',
        router => {
          if (router) {
            this.subscribe()
            routerSubscription()
          } else {
            this.matchSubscription?.call(this)
          }
        },
      )
    }
  }

  private subscribe() {
    this.matchSubscription = eventBus.on(
      ROUTE_EVENTS.RouteMatchedExact,
      ({ route, match }: { route: Route; match: MatchResults }) => {
        this.route = route
        this.match = match
      },
    )
    this.route = navigationState.router?.exactRoute || null
    this.match = navigationState.router?.exactRoute?.match || null
  }

  async componentWillRender() {
    if (this.route) {
      this.next = (await this.route!.nextRoute()) || null
    }
  }

  render() {
    return (
      <Host>
        {this.next ? (
          <a href={this.next.path}>
            <slot>{this.next.title}</slot>
          </a>
        ) : null}
      </Host>
    )
  }

  disconnectedCallback() {
    this.matchSubscription?.call(this)
    this.finalizeSubscription?.call(this)
  }
}
