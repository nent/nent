import {
  Component,
  Element,
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
 * This component enables app services. These are console logging,
 * theming and event-delegation. As well as a plugin system to
 * manage a UI kit to add components like Modals, Drawers,
 * menus, etc.
 *
 * @system app
 * @extension actions
 * @extension custom
 * @extension elements
 */
@Component({
  tag: 'n-app',
  styleUrl: 'app.css',
  shadow: false,
})
export class App {
  private eventSubscription!: () => void
  private actionsSubscription!: () => void
  private listener!: AppActionListener

  @Element() el!: HTMLNAppElement

  /**
   * This is the application / site title.
   * If the views have titles,
   * this is added as a suffix.
   */
  @Prop() appTitle?: string

  /**
   * Turn on debugging to get helpful messages from the
   * app, routing, data and action systems.
   */
  @Prop() debug = false

  /**
   * Listen for events that occurred within the nent event system.
   */
  @Event({
    eventName: 'nent:events',
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  events!: EventEmitter

  /**
   * These events are command-requests for action handlers to perform tasks.
   * Any outside handlers should cancel the event.
   */
  @Event({
    eventName: 'nent:actions',
    composed: true,
    cancelable: true,
    bubbles: false,
  })
  actions!: EventEmitter

  /**
   * Listen for outside command-requests. These events are delegated into
   * the internal action-bus.
   */
  @Listen('nent:actions', {
    passive: true,
    target: 'body',
  })
  delegateActionEventFromDOM(ev: CustomEvent<EventAction<any>>) {
    const action = ev.detail
    actionBus.emit(action.topic, action)
  }

  componentWillLoad() {
    commonState.debug = this.debug

    if (this.debug) {
      log('n-app: initializing <debug>')
    } else {
      log(`n-app: initializing`)
    }

    this.listener = new AppActionListener()
    this.listener.initialize(window, actionBus, eventBus)

    debugIf(
      commonState.debug,
      `n-app: services and listener registered`,
    )

    this.actionsSubscription = actionBus.on('*', (...args) => {
      this.actions.emit(...args)
    })

    this.eventSubscription = eventBus.on('*', (...args) => {
      this.events.emit(...args)
    })
  }

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
