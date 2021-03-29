import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
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
import { CookieConsent } from './cookie/interfaces'
import { CookieService } from './cookie/service'

/**
 * This component enables the *Cookie Data Provider*,
 * after requesting consent from the user. The consent
 * message and the accept/reject button are customizable.
 *
 * @system data
 * @actions true
 * @provider true
 */
@Component({
  tag: 'n-data-cookie',
  shadow: true,
  styles: `:host {display:block;}`,
})
export class DataCookie {
  private provider!: CookieService
  private consentKey = 'consent'
  private actionSubscription?: () => void
  @Element() el!: HTMLNDataCookieElement

  @State() hide: boolean = false

  /**
   * When skipConsent is true, the accept-cookies banner will not
   * be displayed before accessing cookie-data.
   */
  @Prop() skipConsent: boolean = false

  /**
   * Provider name to use in nent expressions.
   */
  @Prop() name: string = 'cookie'

  /**
   * This event is raised when the consents to cookies.
   */
  @Event({
    eventName: 'didConsent',
    bubbles: true,
    composed: true,
    cancelable: false,
  })
  didConsent!: EventEmitter<CookieConsent>

  /**
   * Immediately register the provider.
   */
  @Method({
    name: 'registerProvider',
  })
  public async registerProvider() {
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
    await this.provider.set(this.consentKey, true.toString())
    this.didConsent.emit({ consented: true })
    this.hide = true
  }

  async componentWillLoad() {
    this.provider = new CookieService(
      this.el.ownerDocument,
      eventBus,
      this.name,
    )

    if (this.skipConsent) {
      this.registerProvider()
      this.hide = true
      return
    }

    const consented = await this.provider.get(this.consentKey)
    if (consented != null) {
      this.hide = true
      if (consented == 'true') this.registerProvider()
    }
  }

  private async handleConsentResponse(
    ev: MouseEvent,
    consented: boolean,
  ) {
    ev.preventDefault()
    if (consented) {
      await this.registerProvider()
    } else {
      this.hide = true
    }
  }

  disconnectedCallback() {
    removeDataProvider(this.name)
    this.actionSubscription?.call(this)
  }

  render() {
    return (
      <Host hidden={this.hide}>
        <slot />
        <a
          id="accept"
          onClick={async ev =>
            await this.handleConsentResponse(ev, true)
          }
        >
          <slot name="accept">Accept</slot>
        </a>
        <a
          id="reject"
          onClick={async ev =>
            await this.handleConsentResponse(ev, false)
          }
        >
          <slot name="reject">Reject</slot>
        </a>
      </Host>
    )
  }
}
