/* istanbul ignore file */

import { forceUpdate } from '@stencil/core'

import {
  RoutingStateModel,
  routingState,
  onRoutingChange,
} from './state'

export class RouteStateSubscriber {
  private subscription?: () => void
  private stateSubscription?: () => void
  constructor(
    private component: any,
    private setting: keyof RoutingStateModel,
    private settingFunction?: (setting: any) => void,
  ) {
    if (routingState.router) {
      this.subscribeToEvents()
    } else {
      this.stateSubscription = onRoutingChange('router', router => {
        if (router) {
          this.subscribeToEvents()
        } else {
          this.subscription?.call(this)
        }
      })
    }
  }

  private subscribeToEvents() {
    this.subscription = onRoutingChange(this.setting, value => {
      this.settingFunction?.call(this.component, value)
      forceUpdate(this.component)
    })
  }

  public destroy() {
    this.subscription?.call(this)
    this.stateSubscription?.call(this)
  }
}
