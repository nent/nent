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
  warn,
} from '../../services/common'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveRemoteContent } from '../../services/content/remote'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'

/**
 * This component fetches remote HTML and renders it safely and directly
 * into the page when when and where you tell it too, as soon as it renders.
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
  private dataSubscription!: () => void
  private routeSubscription!: () => void

  @Element() el!: HTMLNContentIncludeElement

  @State() contentElement: HTMLElement | null = null

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
   * resolved values. This also commands this component to
   * re-render it's HTML for data-changes. This can affect
   * performance.
   */
  @Prop() resolveTokens: boolean = true

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * A data-token predicate to advise this component when
   * to render (useful if used in a dynamic route or if
   * tokens are used in the 'src' attribute)
   */
  @Prop({ mutable: true }) when?: string

  async componentWillLoad() {
    if (this.resolveTokens || this.when != undefined) {
      if (commonState.dataEnabled) {
        this.dataSubscription = eventBus.on(
          DATA_EVENTS.DataChanged,
          () => {
            forceUpdate(this)
          },
        )
      } else {
        const dataEnabledSubscription = onCommonStateChange(
          'dataEnabled',
          enabled => {
            if (enabled) {
              this.dataSubscription = eventBus.on(
                DATA_EVENTS.DataChanged,
                () => {
                  forceUpdate(this)
                },
              )
              dataEnabledSubscription()
            }
          },
        )
      }
      if (commonState.routingEnabled) {
        this.routeSubscription = eventBus.on(
          ROUTE_EVENTS.RouteChanged,
          () => {
            forceUpdate(this)
          },
        )
      } else {
        const routingEnabledSubscription = onCommonStateChange(
          'routingEnabled',
          enabled => {
            if (enabled) {
              this.routeSubscription = eventBus.on(
                ROUTE_EVENTS.RouteChanged,
                () => {
                  forceUpdate(this)
                },
              )
              routingEnabledSubscription()
              routingState.router?.captureInnerLinks(this.el)
            }
          },
        )
      }
    }
  }

  async componentWillRender() {
    let shouldRender = !this.deferLoad
    if (this.when) shouldRender = await evaluatePredicate(this.when)

    if (shouldRender)
      this.contentElement = this.src
        ? await this.resolveContentElement()
        : null
    else this.contentElement = null
  }

  private async resolveContentElement() {
    try {
      const content = await resolveRemoteContent(
        window,
        this.src,
        this.mode,
        this.resolveTokens,
      )
      if (content == null) return null

      const div = document.createElement('div')
      div.innerHTML = content
      div.className = this.contentClass
      if (commonState.elementsEnabled)
        await resolveChildElementXAttributes(div)
      routingState.router?.captureInnerLinks(div)
      return div
    } catch {
      warn(`n-content: unable to retrieve from ${this.src}`)
      return null
    }
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    replaceHtmlInElement(
      this.el,
      `.${this.contentClass}`,
      this.contentElement,
    )
    return <Host hidden={this.contentElement == null}></Host>
  }
}
