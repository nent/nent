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
  debugIf,
  onCommonStateChange,
  valueToArray,
  warnIf,
} from '../../services/common'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { hasToken, resolveTokens } from '../../services/data/tokens'
import { navigationState } from '../../services/navigation/state'
import { ROUTE_EVENTS } from '../../services/routing/interfaces'
import { filterData } from './filter/jsonata.worker'

/**
 * This tag renders a template for each item in the configured array.
 * The item template uses value expressions to insert data from any
 * data provider as well as the item in the array.
 *
 * @system content
 * @extension data
 */
@Component({
  tag: 'n-content-repeat',
  styles: `n-content-repeat { display: contents; }`,
  shadow: false,
})
export class ContentDataRepeat {
  private dataSubscription!: () => void
  private routeSubscription!: () => void
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
   * A data-token predicate to advise this component when
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

  async componentWillLoad() {
    debugIf(this.debug, 'n-content-repeat: loading')

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
            navigationState.router?.captureInnerLinks(this.el)
          }
        },
      )
    }

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
        await resolveChildElementXAttributes(this.el)
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
        await resolveChildElementXAttributes(this.dynamicContent!)
      }
      this.dynamicContent!.innerHTML = innerContent
      if (navigationState?.router) {
        navigationState.router?.captureInnerLinks(
          this.dynamicContent!,
        )
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
      items = await filterData(filterString, items)
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

  componentDidRender() {}

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }
}
