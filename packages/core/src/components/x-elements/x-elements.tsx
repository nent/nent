import { Component, h, Host } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { ElementsActionListener } from './elements/actions'

/**
 * This element enables element manipulation through x-actions.
 * Add it to the page to perform actions like 'add-css', toggle
 * attributes or to execute functions on the DOM without code.
 *
 * @system elements
 */
@Component({
  tag: 'x-elements',
  shadow: false,
})
export class XElements {
  private listener!: ElementsActionListener

  componentWillLoad() {
    debugIf(
      commonState.debug,
      `x-data: Elements services enabled. Element ACtions Listener registered`,
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
  }
}
