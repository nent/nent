import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import {
  commonState,
  onCommonStateChange,
} from '../../services/common'
import { debugIf, error, warn } from '../../services/common/logging'
import { replaceHtmlInElement } from '../../services/content/elements'
import {
  resolveRemoteContent,
  resolveSrc,
} from '../../services/content/remote'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { filterData } from '../../services/data/jsonata.worker'
import { resolveTokens } from '../../services/data/tokens'
import { routingState } from '../n-views/services/state'
import { renderMarkdown } from './markdown/remarkable.worker'

/**
 * This element converts markdown text to HTML. It can render
 * from an inline-template or from a remote source.
 *
 * @system content
 * @extension data
 * @extension elements
 */
@Component({
  tag: 'n-content-markdown',
  shadow: false,
})
export class ContentMarkdown {
  private readonly contentClass = 'rendered-content'
  private dataSubscription!: () => void
  private renderCache: Record<string, HTMLElement> = {}
  @Element() el!: HTMLNContentMarkdownElement
  @State() location = routingState.location
  private contentElement: HTMLElement | null = null

  /**
   * Remote Template URL
   */
  @Prop() src?: string

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
  @Prop({ mutable: true }) deferLoad: boolean = false

  /**
   * A data-token predicate to advise this element when
   * to render (useful if used in a dynamic route or if
   * tokens are used in the 'src' attribute)
   */
  @Prop() when?: string

  /**
   * Force render with data & route changes.
   */
  @Prop() noCache: boolean = false

  /**
   * The JSONata expression to select the markdown from a json response.
   * see <https://try.jsonata.org> for more info.
   */
  @Prop() json?: string

  private async getContentKey() {
    return this.src
      ? await resolveSrc(this.src)
      : this.childScript
      ? 'script'
      : null
  }

  private get canCache() {
    return this.noCache === false && this.resolveTokens === false
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  async componentWillLoad() {
    if (this.resolveTokens || this.when != undefined) {
      if (commonState.dataEnabled) {
        this.subscribeToDataEvents()
      } else {
        this.dataSubscription = onCommonStateChange(
          'dataEnabled',
          enabled => {
            if (enabled) {
              this.subscribeToDataEvents()
              this.dataSubscription()
            }
          },
        )
      }
    }
  }

  private subscribeToDataEvents() {
    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      () => {
        forceUpdate(this.el)
      },
    )
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad
    if (shouldRender && this.when)
      shouldRender = await evaluatePredicate(this.when)

    if (shouldRender) {
      if (this.contentElement && this.canCache) return
      this.contentElement = await this.resolveContentElement()
    } else {
      this.contentElement = null
    }
  }

  private async resolveContentElement() {
    const key = await this.getContentKey()
    if (key && this.renderCache[key]) return this.renderCache[key]

    const content = this.src
      ? await this.getContentFromSrc()
      : await this.getContentFromScript()
    if (content == null) return null

    const div = document.createElement('div')
    div.innerHTML = (await renderMarkdown(content)) || ''
    div.className = this.contentClass
    if (commonState.elementsEnabled)
      resolveChildElementXAttributes(div)
    routingState.router?.captureInnerLinks(div)
    this.highlight(div)
    if (key && this.canCache) this.renderCache[key] = div
    return div
  }

  private async getContentFromSrc() {
    try {
      let content = await resolveRemoteContent(
        window,
        this.src!,
        this.mode,
        this.resolveTokens,
      )
      if (content && this.json) {
        debugIf(
          commonState.debug,
          `n-content-markdown: filtering: ${this.json}`,
        )
        const data = JSON.parse(content)
        content = await filterData(this.json, data)
      }

      return content
    } catch (err) {
      error(
        `n-content-markdown: unable to retrieve content from ${this.src}. ${err}`,
      )
      return null
    }
  }

  private async getContentFromScript() {
    const element = this.childScript
    if (!element?.textContent) return null

    let content = this.dedent(element.textContent)
    if (this.resolveTokens) content = await resolveTokens(content)

    return content
  }

  private dedent(innerText: string) {
    const string = innerText?.replace(/^\n/, '')
    const match = string?.match(/^\s+/)
    return match
      ? string?.replace(new RegExp(`^${match[0]}`, 'gm'), '')
      : string
  }

  private highlight(container: HTMLElement) {
    const win = window as any
    const prism = win.Prism
    if (prism?.highlightAllUnder) {
      prism.highlightAllUnder(container)
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
    this.dataSubscription?.call(this)
  }
}
