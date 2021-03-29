import { Component, Element, Prop } from '@stencil/core'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/actions'
import {
  addDataProvider,
  removeDataProvider,
} from '../../services/data/factory'
import { DATA_COMMANDS, SetData } from '../n-data/services/interfaces'
import { SessionService } from './session/service'

@Component({
  tag: 'n-data-session',
  shadow: false,
})

/**
 *  This component enables the **Session Data Provider**.
 *  It leverages the short-lived browser storage.
 *
 *  @system data
 *  @actions true
 *  @provider true
 */
export class DataSession {
  private provider!: SessionService
  private actionSubscription?: () => void
  @Element() el!: HTMLNDataSessionElement

  /**
   * The key prefix to use in storage
   */
  @Prop() keyPrefix?: string

  /**
   * Provider name to use in nent expressions.
   */
  @Prop() name: string = 'session'

  private registerProvider() {
    addDataProvider(this.name, this.provider)
    this.actionSubscription = actionBus.on(
      this.name,
      async (action: EventAction<SetData>) => {
        if (action.command == DATA_COMMANDS.SetData) {
          const { data } = action
          await Promise.all(
            Object.keys(action.data).map(key =>
              this.provider.set(key, data[key]),
            ),
          )
        }
      },
    )
  }

  componentWillLoad() {
    this.provider = new SessionService(
      window,
      eventBus,
      this.name,
      this.keyPrefix,
    )
    this.registerProvider()
  }

  disconnectedCallback() {
    removeDataProvider(this.name)
    this.actionSubscription?.call(this)
  }

  render() {
    return null
  }
}
