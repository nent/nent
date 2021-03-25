import { Component } from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { UIActionListener } from './ui/actions'

/**
 * This component enables th UI services. These are typically
 * web component plug-ins to manage things like Modals, Drawers,
 * menus, etc. The basic provider is used to toggle dark-mode.
 *
 * @system ui
 */
@Component({
  tag: 'x-ui',
  shadow: true,
})
export class XUI {
  private listener!: UIActionListener
  componentWillLoad() {
    debugIf(
      commonState.debug,
      `x-ui: services enabled. UI listener registered`,
    )
    this.listener = new UIActionListener()
    this.listener.initialize(window, actionBus, eventBus)
  }

  render() {
    return null
  }

  disconnectedCallback() {
    this.listener.destroy()
  }
}
