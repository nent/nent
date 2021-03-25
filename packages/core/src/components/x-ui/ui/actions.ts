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
import { getUIProvider, setUIProvider } from './factory'
import { UI_COMMANDS, UI_TOPIC } from './interfaces'
import { DefaultUIProvider } from './providers/default'

export class UIActionListener implements IEventActionListener {
  actionsSubscription!: () => void
  defaultProvider!: any
  eventBus!: IEventEmitter

  initialize(
    win: Window,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter,
  ): void {
    this.eventBus = eventBus
    this.actionsSubscription = actionBus.on(UI_TOPIC, e => {
      this.handleAction(e)
    })
    this.defaultProvider = new DefaultUIProvider(win, eventBus)
  }

  handleAction(actionEvent: EventAction<any>) {
    debugIf(
      commonState.debug,
      `document-listener: action received ${JSON.stringify(
        actionEvent,
      )}`,
    )

    if (actionEvent.command === UI_COMMANDS.RegisterProvider) {
      const { name = 'unknown', provider } = actionEvent.data
      if (provider) {
        setUIProvider(name, provider)
      }
    } else {
      const currentProvider = getUIProvider() as any
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

  destroy() {
    this.actionsSubscription()
    this.defaultProvider?.destroy()
  }
}
