import { forceUpdate } from '@stencil/core'
import { IEventEmitter } from './interfaces'
import {
  commonState,
  CommonStateModel,
  onCommonStateChange,
} from './state'

export class ComponentRefresher {
  private subscription!: () => void
  private stateSubscription!: () => void
  constructor(
    private component: any,
    private eventBus: IEventEmitter,
    commonSetting: keyof CommonStateModel,
    private eventName: string,
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
    this.subscription = this.eventBus.on(this.eventName, () => {
      forceUpdate(this.component)
    })
  }

  destroy() {
    this.subscription?.call(this)
    this.stateSubscription?.call(this)
  }
}
