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

/* It listens for actions on the `DATA_TOPIC` topic, and when it receives a
`DATA_COMMANDS.RegisterDataProvider` command, it registers the provider with the `addDataProvider`
function */
export class DataListener implements IEventActionListener {
  private eventBus!: IEventEmitter
  disposeHandles: Array<() => void> = []

  /**
   * > This function is called when the plugin is initialized. It sets up an event listener for the
   * `DATA_TOPIC` event on the `actionBus` and calls `handleAction` when the event is emitted
   * @param {Window} _window - Window - The window object
   * @param {IEventEmitter} actionBus - This is the event emitter that is used to listen for actions.
   * @param {IEventEmitter} eventBus - This is the event bus that the plugin will use to emit events.
   */
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
      const { name, provider } =
        actionEvent.data as DataProviderRegistration
      if (name && provider) {
        this.registerProvider(name, provider)
      }
    }
  }

  destroy() {
    this.disposeHandles.forEach(h => h?.call(this))
  }
}
