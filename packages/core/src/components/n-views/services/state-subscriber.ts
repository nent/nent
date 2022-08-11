/* istanbul ignore file */

import { forceUpdate } from '@stencil/core'

import {
  RoutingStateModel,
  routingState,
  onRoutingChange,
} from './state'

/* It subscribes to changes in the routing state and updates the component when the setting changes */
export class RouteStateSubscriber {
  private subscription?: () => void
  private stateSubscription?: () => void
  /**
   * If the router is already set, subscribe to the router events. Otherwise, wait for the router to be
   * set and then subscribe to the router events
   * @param {any} component - any - The component that you want to subscribe to.
   * @param setting - keyof RoutingStateModel
   * @param [settingFunction] - This is a function that will be called when the setting is changed.
   */
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

  /**
   * It unsubscribes from the observable.
   */
  public destroy() {
    this.subscription?.call(this)
    this.stateSubscription?.call(this)
  }
}
