import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
} from '@stencil/core'
import { warn } from '../../services/common/logging'
import {
  hasReference,
  markReference,
  ReferenceCompleteResults,
  ReferenceType,
} from '../../services/content'

/**
 * This component makes a single reference to script and css sources. It can
 * be used by HTML fragment to ensure a reference is made, without worry
 * that it will create duplicate references.
 * @system content
 */
@Component({
  tag: 'x-content-reference',
  shadow: false,
})
export class XContentReference {
  @Element() el!: HTMLXContentReferenceElement
  private linkElement?: HTMLLinkElement
  private scriptElement?: HTMLScriptElement

  /**
   * The css file to reference
   */
  @Prop() styleSrc?: string

  /**
   * The script file to reference.
   */
  @Prop() scriptSrc?: string

  /**
   * Import the script file as a module.
   */
  @Prop() module: boolean = false

  /**
   * Declare the script only for use when
   * modules aren't supported
   */
  @Prop() noModule: boolean = false

  /**
   * When inline the link/script tags are rendered in-place
   * rather than added to the head.
   */
  @Prop() inline: boolean = false

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * Timeout (in milliseconds) to wait for the references
   * to load.
   */
  @Prop() timeout = 1000

  /**
   * This event is fired when the script and style
   * elements are loaded or timed out. The value for each
   * style and script will be true or false, for loaded
   * or timedout, respectively.
   */
  @Event({
    eventName: 'referenced',
    bubbles: true,
    cancelable: false,
  })
  reference!: EventEmitter<ReferenceCompleteResults>

  /**
   * Force the 'load' event of the script or link element.
   * This is meant for testing.
   *
   */
  @Method()
  async forceLoad() {
    this.scriptElement?.dispatchEvent(new CustomEvent('load'))
    this.linkElement?.dispatchEvent(new CustomEvent('load'))
  }

  private registered(type: ReferenceType, loaded: boolean) {
    this.reference.emit({ type, loaded })
  }

  private async getStylePromise(element: HTMLHeadElement) {
    if (this.styleSrc && !hasReference(this.styleSrc)) {
      const url = this.styleSrc
      return new Promise<void>(resolve => {
        this.linkElement = this.el.ownerDocument.createElement('link')
        this.linkElement.href = url
        this.linkElement.rel = 'stylesheet'
        let loaded = false

        this.linkElement.addEventListener('load', () => {
          loaded = true
          markReference(url)
          this.registered(ReferenceType.styles, loaded)
          resolve()
        })
        element.append(this.linkElement)
        setTimeout(() => {
          if (!loaded) {
            this.registered(ReferenceType.styles, false)
            warn(
              `Stylesheet '${url}' did not load before the ${this.timeout} timeout.`,
            )
            resolve()
          }
        }, this.timeout)
      })
    }
  }

  private getScriptPromise(element: HTMLHeadElement) {
    // Make the style reference
    if (this.scriptSrc && !hasReference(this.scriptSrc)) {
      const url = this.scriptSrc
      return new Promise<void>(resolve => {
        this.scriptElement = this.el.ownerDocument.createElement(
          'script',
        )
        this.scriptElement.src = url
        let loaded = false

        if (this.module) {
          this.scriptElement.type = 'module'
        } else if (this.noModule) {
          this.scriptElement.setAttribute('nomodule', '')
        }

        this.scriptElement.addEventListener('load', () => {
          loaded = true
          markReference(url)
          this.registered(ReferenceType.script, loaded)
          resolve()
        })

        element.append(this.scriptElement)
        setTimeout(() => {
          if (!loaded) {
            this.registered(ReferenceType.script, false)
            warn(
              `Script '${url}' did not load before the ${this.timeout} timeout.`,
            )
            resolve()
          }
        }, this.timeout)
      })
    }
  }

  async componentWillRender() {
    if (this.deferLoad) {
      return
    }

    const element = this.inline ? this.el : this.el.ownerDocument.head

    await this.getStylePromise(element)

    await this.getScriptPromise(element)
  }

  disconnectedCallback() {}
}
