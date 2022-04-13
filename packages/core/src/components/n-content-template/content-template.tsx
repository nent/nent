import { Component, Element, Prop, State } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { ComponentRefresher } from '../../services/common'
import { debugIf, warn } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { fetchJson } from '../../services/content'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { filterData } from '../../services/data/jsonata.worker'
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
  shadow: false,
})
export class ContentTemplate {
  private dataSubscription!: ComponentRefresher
  private routeSubscription!: ComponentRefresher
  private contentClass = 'dynamic'
  @Element() el!: HTMLNContentTemplateElement
  @State() innerTemplate!: string
  @State() contentElement: HTMLElement | null = null

  /**
   * The data expression to obtain a value for rendering as inner-text for this element.
   *
   * @default null
   */
  @Prop() text?: string

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * The URL to remote JSON data to bind to this template
   * @example /data.json
   */
  @Prop() src?: string

  /**
   * The JSONata query to filter the json items
   * see <https://try.jsonata.org> for more info.
   */
  @Prop() filter?: string

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug: boolean = false

  /**
   * Force render with data & route changes.
   */
  @Prop() noCache: boolean = false

  /**
   * A data-token predicate to advise this element when
   * to render (useful if used in a dynamic route or if
   * tokens are used in the 'src' attribute)
   */
  @Prop() when?: string

  /**
   * Cross Origin Mode
   */
  @Prop() mode: 'cors' | 'navigate' | 'no-cors' | 'same-origin' =
    'cors'

  /**
   * When declared, the child script tag is required and should be
   * the query text for the request. Also, this forces the HTTP
   * method to 'POST'.
   */
  @Prop() graphql: boolean = false

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
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad
    if (shouldRender && this.when)
      shouldRender = await evaluatePredicate(this.when)

    if (shouldRender)
      this.contentElement = await this.resolveContentElement()
    else this.contentElement = null
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
      resolveChildElementXAttributes(container)
    }
    if (routingState.router) {
      routingState.router?.captureInnerLinks(container)
    }
    return container
  }

  private async getContent() {
    let content: string | null = null
    const data = await this.resolveData()
    if (this.innerTemplate) {
      content = await resolveTokens(this.innerTemplate, false, data)
    } else if (this.text) {
      content = await resolveTokens(this.text, false, data)
    }
    return content
  }

  private async resolveData() {
    let data: any = {}

    if (this.el.dataset) {
      Object.assign(data, this.el.dataset)
    }
    if (this.childScript !== null && !this.graphql) {
      try {
        const json = JSON.parse(this.childScript.textContent || '')
        data = Object.assign(data, json)
      } catch (error) {
        warn(
          `n-content-template: unable to deserialize JSON: ${error}`,
        )
      }
    }

    if (this.src) {
      try {
        let remoteData = this.graphql
          ? await fetchJson(
              window,
              this.src,
              this.mode,
              'POST',
              JSON.stringify({
                query: this.childScript?.textContent || '',
              }),
            )
          : await fetchJson(window, this.src, this.mode)
        data = Object.assign(data, remoteData)
        if (this.filter) {
          debugIf(
            this.debug,
            `n-content-template: filtering: ${this.filter}`,
          )
          data = await filterData(this.filter, remoteData)
        }
      } catch (error) {
        warn(
          `n-content-template: unable to fetch and filter data data ${error}`,
        )
      }
    }

    return data
  }

  render() {
    replaceHtmlInElement(
      this.el,
      `.${this.contentClass}`,
      this.contentElement,
    )
    return null
  }

  disconnectedCallback() {
    this.dataSubscription.destroy()
    this.routeSubscription.destroy()
  }
}
