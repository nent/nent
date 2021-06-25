import { Component, Element, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { ComponentRefresher } from '../../services/common'
import { warn } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { resolveTokens } from '../../services/data/tokens'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'
/**
 * Render data directly into HTML using declarative expressions.
 * This element renders the expression with all data-tokens
 * replaced with the values provided by the provider.
 *
 * @system content
 * @extension data
 * @extension elements
 */
@Component({
  tag: 'n-content-template',
  styleUrl: 'content-template.css',
  shadow: false,
})
export class ContentTemplate {
  private dataSubscription!: ComponentRefresher
  private routeSubscription!: ComponentRefresher
  private contentClass = 'dynamic'
  @Element() el!: HTMLNContentTemplateElement
  @State() innerTemplate!: string
  @State() innerData: any
  @State() contentElement: HTMLElement | null = null

  /**
   * The data expression to obtain a value for rendering as inner-text for this element.
   * {{session:user.name}}
   * @default null
   */
  @Prop() text?: string

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  private get childTemplate(): HTMLTemplateElement | null {
    return this.el.querySelector('template')
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  componentWillLoad() {
    this.dataSubscription = new ComponentRefresher(
      this,
      eventBus,
      'dataEnabled',
      DATA_EVENTS.DataChanged,
    )

    this.routeSubscription = new ComponentRefresher(
      this,
      eventBus,
      'routingEnabled',
      ROUTE_EVENTS.RouteChanged,
    )

    if (this.childTemplate !== null) {
      this.innerTemplate = this.childTemplate.innerHTML
    }

    if (this.childScript !== null) {
      try {
        this.innerData = JSON.parse(
          this.childScript.textContent || '',
        )
      } catch (error) {
        warn(
          `n-content-template: unable to deserialize JSON: ${error}`,
        )
      }
    }
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad

    if (shouldRender)
      this.contentElement = await this.resolveContentElement()
    else this.contentElement = null

    replaceHtmlInElement(
      this.el,
      `.${this.contentClass}`,
      this.contentElement,
    )
  }

  private async getContent() {
    let content: string | null = null
    if (this.text) {
      content = await resolveTokens(this.text, false, this.innerData)
    }

    if (this.innerTemplate) {
      content = await resolveTokens(
        this.innerTemplate,
        false,
        this.innerData,
      )
    }
    return content
  }

  private async resolveContentElement() {
    const content = await this.getContent()
    if (content == null) return null

    const container = document.createElement(
      this.innerTemplate ? 'div' : 'span',
    )
    container.innerHTML = content
    container.className = this.contentClass
    if (commonState.elementsEnabled) {
      await resolveChildElementXAttributes(container)
    }
    if (routingState.router) {
      routingState.router?.captureInnerLinks(container)
    }
    return container
  }

  disconnectedCallback() {
    this.dataSubscription.destroy()
    this.routeSubscription.destroy()
  }
}
