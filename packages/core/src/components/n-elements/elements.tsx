import { Component, Element, h, Host, Prop } from '@stencil/core'
import { eventBus } from '../../services/actions'
import { debugIf } from '../../services/common/logging'
import {
  commonState,
  onCommonStateChange,
} from '../../services/common/state'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { ElementsActionListener } from './services/actions'

/**
 * This element enables element manipulation through n-actions.
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
  private dataSubscription!: () => void
  private listener!: ElementsActionListener

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug = false

  componentWillLoad() {
    debugIf(this.debug, `n-elements: initialized`)

    this.listener = new ElementsActionListener()
    commonState.elementsEnabled = true

    if (commonState.dataEnabled) {
      this.subscribeToDataEvents()
    } else {
      const dataSubscription = onCommonStateChange(
        'dataEnabled',
        enabled => {
          if (enabled) {
            this.subscribeToDataEvents()
            dataSubscription()
          }
        },
      )
    }
  }

  private subscribeToDataEvents() {
    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      async () => {
        debugIf(this.debug, `n-elements: data changed `)
        await resolveChildElementXAttributes(
          this.el.ownerDocument.body,
        )
      },
    )
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    this.listener.destroy()
    commonState.elementsEnabled = false
    this.dataSubscription?.call(this)
  }
}
