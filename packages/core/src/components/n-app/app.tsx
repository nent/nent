import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
} from '@stencil/core'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/actions'
import { debugIf, log } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { AppActionListener } from './services/actions'

/**
 * This component enables app services. These are console logging
 * theming and event-delegation as well as a plugin system to
 * manage a UI kit to add components like Modals, Drawers,
 * menus, etc. The basic provider is used to toggle dark-mode.
 *
 * @system app
 * @actions true
 */
@Component({
  tag: 'n-app',
  styles: 'n-app { display: contents; }',
  shadow: false,
})
export class App {
  private eventSubscription!: () => void
  private actionsSubscription!: () => void
  private listener!: AppActionListener

  /**
   * Turn on debugging to get helpful messages from the
   * app, routing, data and action systems.
   */
  @Prop() debug = false

  /**
   * Turn off declarative actions for the entire
   * app.
   */
  @Prop() disableActions = false

  /**
   * Listen for events that occurred within the **`<n-views>`**
   * system.
   */
  @Event({
    eventName: 'nent:events',
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  events!: EventEmitter

  componentWillLoad() {
    commonState.debug = this.debug

    if (this.debug) {
      log('n-app: initializing <debug>')
    } else {
      log(`n-app: initializing`)
    }

    if (this.disableActions) {
      commonState.actionsEnabled = false
      return
    }

    this.listener = new AppActionListener()
    this.listener.initialize(window, actionBus, eventBus)

    debugIf(
      commonState.debug,
      `n-app: services and listener registered`,
    )

    this.actionsSubscription = actionBus.on('*', (_topic, args) => {
      this.actions.emit(args)
    })

    this.eventSubscription = eventBus.on('*', args => {
      this.events.emit(args)
    })
  }

  @Listen('nent:actions', {
    passive: true,
    target: 'body',
  })
  delegateActionEventFromDOM(ev: CustomEvent<EventAction<any>>) {
    const action = ev.detail
    actionBus.emit(action.topic, action)
  }

  /**
   * These events are **`<n-views>`** command-requests for
   * action handlers to perform tasks. Any handles should
   * cancel the event.
   */
  @Event({
    eventName: 'nent:actions',
    composed: true,
    cancelable: true,
    bubbles: false,
  })
  actions!: EventEmitter

  render() {
    return <Host></Host>
  }

  componentDidLoad() {
    log('n-app: initialized')
  }

  disconnectedCallback() {
    this.listener.destroy()
    this.actionsSubscription?.call(this)
    this.eventSubscription?.call(this)
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
  }
}
