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
import { StorageService } from './storage/service'

@Component({
  tag: 'n-data-storage',
  shadow: false,
})

/**
 * This component enables the **Storage Data Provider**, that
 * leverages the browser 'long-term' data storage.
 *
 * @system data
 */
export class DataStorage {
  private provider!: StorageService
  private actionSubscription?: () => void
  @Element() el!: HTMLNDataStorageElement

  /**
   * The key prefix to use in storage
   */
  @Prop() keyPrefix?: string

  /**
   * Provider name to use in nent expressions.
   */
  @Prop() name: string = 'storage'

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
    this.provider = new StorageService(
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
