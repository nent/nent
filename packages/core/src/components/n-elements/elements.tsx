import { Component, h, Host } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { ElementsActionListener } from './elements/actions'

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
  private listener!: ElementsActionListener

  componentWillLoad() {
    debugIf(
      commonState.debug,
      `n-elements: Elements services enabled. Element ACtions Listener registered`,
    )

    this.listener = new ElementsActionListener()
    commonState.elementsEnabled = true
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }

  disconnectedCallback() {
    this.listener.destroy()
    commonState.elementsEnabled = false
  }
}
