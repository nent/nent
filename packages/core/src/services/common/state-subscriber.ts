/* istanbul ignore file */

import { forceUpdate } from '@stencil/core'
import { eventBus } from '../actions'
import { IEventEmitter } from './interfaces'
import {
  commonState,
  CommonStateModel,
  onCommonStateChange,
} from './state'

export class CommonStateSubscriber {
  private subscription!: () => void
  private stateSubscription!: () => void
  constructor(
    private component: any,
    commonSetting: keyof CommonStateModel,
    private eventName: string,
    private events: IEventEmitter = eventBus,
  ) {
    if (commonState[commonSetting]) {
      this.subscribeToEvents()
    } else {
      this.stateSubscription = onCommonStateChange(
        commonSetting,
        enabled => {
          if (enabled) {
            this.subscribeToEvents()
          } else {
            this.subscription?.call(this)
          }
        },
      )
    }
  }

  private subscribeToEvents() {
    this.subscription = this.events.on(this.eventName, () => {
      forceUpdate(this.component)
    })
  }

  public destroy() {
    this.subscription?.call(this)
    this.stateSubscription?.call(this)
  }
}
