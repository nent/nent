import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import {
  commonState,
  ComponentRefresher,
  debugIf,
  valueToArray,
  warnIf,
} from '../../services/common'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { filterData } from '../../services/data/jsonata.worker'
import { hasToken, resolveTokens } from '../../services/data/tokens'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'

/**
 * This tag renders a template for each item in the configured array.
 * The item template uses value expressions to insert data from any
 * data provider as well as the item in the array.
 *
 * @system content
 * @extension data
 * @extension elements
 */
@Component({
  tag: 'n-content-repeat',
  shadow: false,
})
export class ContentDataRepeat {
  private dataSubscription!: ComponentRefresher
  private routeSubscription!: ComponentRefresher
  @Element() el!: HTMLNContentRepeatElement
  @State() innerTemplate!: string
  @State() resolvedTemplate!: string
  @State() dynamicContent: HTMLElement | null = null
  private contentKey!: string

  /**
   The array-string or data expression to obtain a collection for rendering the template.
   {{session:cart.items}}
   */
  @Prop() items?: string

  /**
   * The URL to remote JSON collection to use for the items.
   * @example /data.json
   */
  @Prop() itemsSrc?: string

  /**
   * The JSONata query to filter the json items
   * see <https://try.jsonata.org> for more info.
   */
  @Prop() filter?: string

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad: boolean = false

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

  get childTemplate(): HTMLTemplateElement | null {
    return this.el.querySelector('template')
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  componentWillLoad() {
    debugIf(this.debug, 'n-content-repeat: loading')

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

    if (this.childTemplate === null) {
      warnIf(
        this.debug,
        'n-content-repeat: missing child <template> tag',
      )
    } else {
      this.innerTemplate = this.childTemplate.innerHTML
    }

    this.contentKey = `data-content`
  }

  async componentWillRender() {
    if (!this.innerTemplate) return

    if (this.dynamicContent && !this.noCache) {
      if (commonState.elementsEnabled) {
        resolveChildElementXAttributes(this.el)
      }
      return
    }

    const remoteContent = this.el.querySelector(`.${this.contentKey}`)
    remoteContent?.remove()
    const items = await this.resolveItems()
    const innerContent = await this.resolveHtml(items)
    if (innerContent) {
      this.dynamicContent = this.el.ownerDocument.createElement('div')
      this.dynamicContent!.className = this.contentKey!
      this.dynamicContent!.innerHTML = innerContent
      if (commonState.elementsEnabled) {
        resolveChildElementXAttributes(this.dynamicContent!)
      }
      this.dynamicContent!.innerHTML = innerContent
      if (routingState?.router) {
        routingState.router?.captureInnerLinks(this.dynamicContent!)
      }
      this.el.append(this.dynamicContent)
    }
  }

  private async resolveHtml(items: any[]) {
    debugIf(this.debug, 'n-content-repeat: resolving html')
    let shouldRender = !this.deferLoad
    if (shouldRender && this.when)
      shouldRender = await evaluatePredicate(this.when)

    if (!shouldRender) {
      return null
    }

    // DebugIf(this.debug, `n-content-repeat: innerItems ${JSON.stringify(this.resolvedItems || [])}`);
    if (this.innerTemplate) {
      let resolvedTemplate = ''

      return await items.reduce(
        (previousPromise: Promise<any>, item: any) =>
          previousPromise.then(async () =>
            resolveTokens(
              this.innerTemplate.slice(),
              false,
              item,
            ).then(html => {
              resolvedTemplate += html
              return resolvedTemplate
            }),
          ),
        Promise.resolve(),
      )
    }
    return null
  }

  private async resolveItems() {
    let items = []
    if (this.items) {
      items = await this.resolveItemsExpression()
    } else if (this.childScript) {
      try {
        let text =
          this.childScript.textContent?.replace('\n', '') || ''
        text =
          commonState.dataEnabled && hasToken(text)
            ? await resolveTokens(text, true)
            : text
        items = valueToArray(JSON.parse(text || '[]'))
      } catch (error) {
        warnIf(
          this.debug,
          `n-content-repeat: unable to deserialize JSON: ${error}`,
        )
      }
    } else if (this.itemsSrc) {
      items = await this.fetchJson()
    } else {
      warnIf(
        this.debug,
        'n-content-repeat: you must include at least one of the following: items, json-src or a <script> element with a JSON array.',
      )
    }
    if (this.filter) {
      let filterString = this.filter.slice()
      if (hasToken(filterString)) {
        filterString = await resolveTokens(filterString)
      }

      debugIf(
        this.debug,
        `n-content-repeat: filtering: ${filterString}`,
      )
      items = valueToArray(await filterData(filterString, items))
    }
    return items
  }

  private async fetchJson() {
    try {
      debugIf(
        this.debug,
        `n-content-repeat: fetching items from ${this.itemsSrc}`,
      )

      const response = await window.fetch(this.itemsSrc!)
      if (response.status === 200) {
        const data = await response.json()
        return valueToArray(data)
      }
      warnIf(
        this.debug,
        `n-content-repeat: Unable to parse response from ${this.itemsSrc}`,
      )
    } catch (err) {
      warnIf(
        this.debug,
        `n-content-repeat: Unable to parse response from ${this.itemsSrc}: ${err}`,
      )
    }
    return []
  }

  private async resolveItemsExpression() {
    let items = []
    try {
      let itemsString = this.items
      if (itemsString && hasToken(itemsString)) {
        itemsString = await resolveTokens(itemsString)
        debugIf(
          this.debug,
          `n-content-repeat: items resolved to ${itemsString}`,
        )
      }

      items = itemsString ? JSON.parse(itemsString) : []
    } catch (error) {
      warnIf(
        this.debug,
        `n-content-repeat: unable to deserialize JSON: ${error}`,
      )
    }
    return items
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }

  disconnectedCallback() {
    this.dataSubscription!.destroy()
    this.routeSubscription!.destroy()
  }
}
