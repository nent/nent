import {
  EventAction,
  IEventActionListener,
} from '../../../services/actions'
import {
  commonState,
  debugIf,
  IEventEmitter,
  kebabToCamelCase,
} from '../../../services/common'
import { getAppProvider, setAppProvider } from './factory'
import { APP_COMMANDS, APP_TOPIC } from './interfaces'
import { DefaultAppProvider } from './providers/default'

/* It listens for actions on the `APP_TOPIC` topic, and then calls the appropriate function on the
`AppProvider` that is registered for the current document */
export class AppActionListener implements IEventActionListener {
  actionsSubscription!: () => void
  defaultProvider!: any
  eventBus!: IEventEmitter

  /**
   * > This function is called by the `AppManager` to initialize the `AppProvider` with the `Window`
   * object, the `actionBus` and the `eventBus`
   * @param {Window} win - Window - the window object
   * @param {IEventEmitter} actionBus - This is the event bus that the app will use to listen for
   * actions.
   * @param {IEventEmitter} eventBus - This is the event bus that the app will use to communicate with
   * the rest of the application.
   */
  public initialize(
    win: Window,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter,
  ): void {
    this.eventBus = eventBus
    this.actionsSubscription = actionBus.on(APP_TOPIC, e => {
      this.handleAction(e)
    })
    this.defaultProvider = new DefaultAppProvider(win, eventBus)
  }

  handleAction(actionEvent: EventAction<any>) {
    debugIf(
      commonState.debug,
      `document-listener: action received ${JSON.stringify(
        actionEvent,
      )}`,
    )

    if (actionEvent.command === APP_COMMANDS.RegisterProvider) {
      const { name = 'unknown', provider } = actionEvent.data
      if (provider) {
        setAppProvider(name, provider)
      }
    } else {
      const currentProvider = getAppProvider() as any
      const commandFuncKey = kebabToCamelCase(actionEvent.command)

      // Use the registered provider unless it doesn't implement this command
      let commandFunc = currentProvider
        ? currentProvider[commandFuncKey]
        : null
      if (!commandFunc)
        commandFunc = this.defaultProvider[commandFuncKey]

      if (commandFunc && typeof commandFunc === 'function') {
        commandFunc.call(this.defaultProvider, actionEvent.data)
      }
    }
  }

  /**
   * It unsubscribes from the actions subscription and destroys the default provider.
   */
  public destroy() {
    this.actionsSubscription()
    this.defaultProvider?.destroy()
  }
}
