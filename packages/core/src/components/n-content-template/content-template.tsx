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
import { hasToken, resolveTokens } from '../../services/data/tokens'
import { filterData } from '../n-content-repeat/filter/jsonata.worker'
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
      await resolveChildElementXAttributes(container)
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
    if (this.childScript !== null) {
      try {
        const json = JSON.parse(this.childScript.textContent || '')
        data = Object.assign(data, json)
      } catch (error) {
        warn(
          `n-content-template: unable to deserialize JSON: ${error}`,
        )
      }
    }

    let remote: any = {}
    if (this.src) {
      try {
        remote = await fetchJson(window, this.src, this.mode)
        if (this.filter) {
          let filterString = this.filter.slice()
          debugIf(
            this.debug,
            `n-content-template: filtering: ${filterString}`,
          )
          remote = await filterData(filterString, data)
        }
      } catch (error) {
        warn(
          `n-content-template: unable to fetch and filter data data ${error}`,
        )
      }

      data = Object.assign(data, remote)
    }

    if (commonState.dataEnabled) {
      for await (const _ of Object.keys(data).map(async name => {
        data[name] = hasToken(data[name])
          ? await resolveTokens(data[name])
          : data[name]
      })) {
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
