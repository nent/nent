import { Component, Element, Prop } from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { debugIf } from '../../services/common/logging'
import {
  commonState,
  onCommonStateChange,
} from '../../services/common/state'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import {
  addDataProvider,
  removeDataProvider,
} from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { ElementsActionListener } from './services/actions'
import { ElementsDataProvider } from './services/provider'

/**
 * This element enables element manipulation through the n-actions element.
 * Add it to the page to perform actions like 'add-css', toggle
 * attributes or to execute functions on the DOM without code.
 *
 * @system elements
 * @extension actions
 */
@Component({
  tag: 'n-elements',
  shadow: false,
})
export class Elements {
  @Element() el!: HTMLNElementsElement
  private dataSubscription?: () => void
  private listener!: ElementsActionListener
  private provider?: ElementsDataProvider

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug = false

  componentWillLoad() {
    debugIf(this.debug, `n-elements: initialized`)

    this.listener = new ElementsActionListener()

    this.listener.initialize(window, actionBus, eventBus)
    commonState.elementsEnabled = true

    if (commonState.dataEnabled) {
      this.subscribeToDataEvents()
    } else {
      const dispose = onCommonStateChange(
        'dataEnabled',
        (enabled: Boolean) => {
          if (enabled) {
            this.subscribeToDataEvents()
          }
          dispose()
        },
      )
    }
  }

  private subscribeToDataEvents() {
    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      () => {
        debugIf(this.debug, `n-elements: data changed `)
        resolveChildElementXAttributes(this.el.ownerDocument.body)
      },
    )
    this.provider = new ElementsDataProvider(
      this.el.ownerDocument,
      this.listener,
    )
    addDataProvider('elements', this.provider!)
  }

  disconnectedCallback() {
    this.listener.destroy()
    commonState.elementsEnabled = false
    this.dataSubscription?.call(this)
    removeDataProvider('elements')
  }
}
