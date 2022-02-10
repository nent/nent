import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
} from '@stencil/core'
import {
  ReferenceCompleteResults,
  ReferenceType,
} from './services/interfaces'
import { hasReference, markReference } from './services/references'

/**
 * This element makes a single reference to script and css sources. It can
 * be used by HTML fragment to ensure a reference is made, without worrying
 * that it will create duplicate references.
 *
 * @system content
 */
@Component({
  tag: 'n-content-reference',
  shadow: false,
})
export class ContentReference {
  @Element() el!: HTMLNContentReferenceElement
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

  private registered(type: ReferenceType, loaded: boolean) {
    this.reference.emit({ type, loaded })
  }

  private async createStyleElement(
    element: HTMLHeadElement,
    url: string,
  ) {
    if (this.linkElement) this.linkElement.remove()

    this.linkElement = this.el.ownerDocument.createElement('link')
    this.linkElement.href = url
    this.linkElement.rel = 'stylesheet'

    element.append(this.linkElement)
  }

  private async createScriptElement(
    element: HTMLHeadElement,
    url: string,
  ) {
    if (this.scriptElement) this.scriptElement.remove()
    this.scriptElement = this.el.ownerDocument.createElement('script')
    this.scriptElement.src = url
    if (this.module) {
      this.scriptElement.type = 'module'
    } else if (this.noModule) {
      this.scriptElement.setAttribute('nomodule', '')
    }

    element.append(this.scriptElement)
  }

  async componentWillRender() {
    if (this.deferLoad) {
      return
    }

    const element = this.inline ? this.el : this.el.ownerDocument.head

    const needStyle =
      this.styleSrc && !(await hasReference(this.styleSrc))
    if (needStyle) {
      this.createStyleElement(element, this.styleSrc!)
      this.registered(ReferenceType.styles, true)
      await markReference(this.styleSrc!)
    }

    const needScript =
      this.scriptSrc && !(await hasReference(this.scriptSrc!))
    if (needScript) {
      this.createScriptElement(element, this.scriptSrc!)
      this.registered(ReferenceType.script, true)
      await markReference(this.scriptSrc!)
    }
  }

  disconnectedCallback() {}
}
