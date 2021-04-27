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
import { performLoadElementManipulation } from '../../services/common/elements'
import { debugIf, log } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { AppActionListener } from './services/actions'

/**
 * This component enables app services. These are console logging
 * theming and event-delegation as well as a plugin system to
 * manage a UI kit to add components like Modals, Drawers,
 * menus, etc. The basic provider is used to toggle dark-mode.
 *
 * This component also adds meta tags necessary for best PWA
 * practices.
 *
 * @system app
 * @extension actions
 * @extension custom
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

  @Element() el!: HTMLNAppElement

  /**
   * The application name
   *
   * Creates tags:
   * * title (if missing)
   * * meta[name="og:title"]
   */
  @Prop() name?: string

  /**
   * The application short-name used in the
   * PWA application manifest.
   */
  @Prop() shortName?: string

  /**
   * The application description used in the
   * PWA application manifest.
   *
   * Creates tags:
   * * description (if missing)
   * * meta[name="og:description"]
   */
  @Prop() description?: string

  /**
   * The application theme color (used )
   */
  @Prop() themeColor?: string

  /**
   * The application theme background-color (used )
   */
  @Prop() backgroundColor?: string

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
    /* ICON
    Add the icon link tag to the header:
     <link rel="icon" type="image/png" href="icon-128.png" sizes="128x128" />
    */

    /* PWA
    Add this tag, with an inline manifest:
     <link rel="manifest" href='' />
    Then add the PWACompat lib for iOS:
     <!-- include PWACompat _after_ manifest -->
     <script async src="https://unpkg.com/pwacompat" crossorigin="anonymous"></script>
    */
    log('n-app: initialized')
    if (commonState.elementsEnabled) {
      performLoadElementManipulation(this.el.ownerDocument.body)
    }
  }

  // private getManifestString() {
  //   return `data:application/manifest+json,{ "name": "${this.name}", "short_name": "${this.shortName}", "description": "${this.description}"}`
  // }

  disconnectedCallback() {
    this.listener.destroy()
    this.actionsSubscription?.call(this)
    this.eventSubscription?.call(this)
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
  }
}
