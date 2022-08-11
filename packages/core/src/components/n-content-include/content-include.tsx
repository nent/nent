import { Component, Element, h, Host, Prop } from '@stencil/core'
import {
  commonState,
  CommonStateSubscriber,
  debugIf,
  warn,
} from '../../services/common'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveRemoteContent } from '../../services/content/remote'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { filterData } from '../../services/data/jsonata.worker'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'

/**
 * This element fetches remote HTML and renders it safely and directly
 * into the page when and where you tell it too, as soon as it renders.
 *
 * @system content
 * @extension data
 * @extension elements
 */
@Component({
  tag: 'n-content-include',
  shadow: false,
})
export class ContentInclude {
  private readonly contentClass = 'remote-content'
  private dataSubscription!: CommonStateSubscriber
  private routeSubscription!: CommonStateSubscriber

  @Element() el!: HTMLNContentIncludeElement

  private contentElement: HTMLElement | null = null

  /**
   * Remote Template URL
   */
  @Prop() src!: string

  /**
   * Cross Origin Mode
   */
  @Prop() mode: 'cors' | 'navigate' | 'no-cors' | 'same-origin' =
    'cors'

  /**
   * Before rendering HTML, replace any data-tokens with their
   * resolved values. This also commands this element to
   * re-render it's HTML for data-changes. This can affect
   * performance.
   */
  @Prop() resolveTokens: boolean = false

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * A data-token predicate to advise this element when
   * to render (useful if used in a dynamic route or if
   * tokens are used in the 'src' attribute)
   */
  @Prop({ mutable: true }) when?: string

  /**
   * The JSONata expression to select the HTML from a json response.
   * see <https://try.jsonata.org> for more info.
   */
  @Prop() json?: string

  componentWillLoad() {
    if (this.resolveTokens || this.when != undefined) {
      this.dataSubscription = new CommonStateSubscriber(
        this,
        'dataEnabled',
        DATA_EVENTS.DataChanged,
      )

      this.routeSubscription = new CommonStateSubscriber(
        this,
        'routingEnabled',
        ROUTE_EVENTS.RouteChanged,
      )
    }
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad
    if (commonState.dataEnabled && this.when) {
      const { evaluatePredicate } = await import(
        '../../services/data/expressions'
      )
      shouldRender = await evaluatePredicate(this.when)
    }

    if (shouldRender)
      this.contentElement = this.src
        ? await this.resolveContentElement()
        : null
    else if (this.resolveTokens) this.contentElement = null
  }

  private async resolveContentElement() {
    try {
      let content = await resolveRemoteContent(
        window,
        this.src,
        this.mode,
        this.resolveTokens,
      )

      if (content && this.json) {
        debugIf(
          commonState.debug,
          `n-content-include: filtering: ${this.json}`,
        )
        const data = JSON.parse(content)
        content = await filterData(this.json, data)
      }

      if (content == null) return null

      const div = document.createElement('div')
      div.innerHTML = content
      div.className = this.contentClass
      if (commonState.elementsEnabled)
        resolveChildElementXAttributes(div)
      routingState.router?.captureInnerLinks(div)
      return div
    } catch {
      warn(`n-content: unable to retrieve from ${this.src}`)
      return null
    }
  }

  render() {
    replaceHtmlInElement(
      this.el,
      `.${this.contentClass}`,
      this.contentElement,
    )
    return <Host hidden={this.contentElement == null}></Host>
  }

  disconnectedCallback() {
    this.dataSubscription?.destroy()
    this.routeSubscription?.destroy()
  }
}
