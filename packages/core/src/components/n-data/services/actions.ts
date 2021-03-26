import {
  EventAction,
  IEventActionListener,
} from '../../../services/actions'
import {
  commonState,
  debugIf,
  IEventEmitter,
} from '../../../services/common'
import { addDataProvider } from '../../../services/data/factory'
import {
  DATA_EVENTS,
  DATA_TOPIC,
  IDataProvider,
} from '../../../services/data/interfaces'
import {
  DataProviderRegistration,
  DATA_COMMANDS,
  SetData,
} from './interfaces'

export class DataListener implements IEventActionListener {
  private eventBus!: IEventEmitter
  disposeHandles: Array<() => void> = []

  public initialize(
    _window: Window,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter,
  ) {
    this.eventBus = eventBus
    const handle = actionBus.on(DATA_TOPIC, e => {
      this.handleAction(e)
    })
    this.disposeHandles.push(handle)
  }

  registerProvider(name: string, provider: IDataProvider) {
    const handle = provider.changed?.on('*', () => {
      debugIf(commonState.debug, `data-provider: ${name} changed`)
      this.eventBus.emit(DATA_EVENTS.DataChanged, {
        provider: name,
      })
    })
    if (handle) this.disposeHandles.push(handle)
    addDataProvider(name, provider)
  }

  async handleAction(
    actionEvent: EventAction<DataProviderRegistration | SetData>,
  ): Promise<void> {
    debugIf(
      commonState.debug,
      `data-listener: action received {command:${actionEvent.command}}`,
    )
    if (actionEvent.command === DATA_COMMANDS.RegisterDataProvider) {
      const {
        name,
        provider,
      } = actionEvent.data as DataProviderRegistration
      if (name && provider) {
        this.registerProvider(name, provider)
      }
    }
  }

  destroy() {
    this.disposeHandles.forEach(h => h?.call(this))
  }
}
