import { Component, h, Host, Prop } from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { debugIf } from '../../services/common/logging'
import { clearDataProviders } from '../../services/data/factory'
import { dataState } from '../../services/data/state'
import { DataListener } from './services/actions'

/**
 * This element enables the Data Provider system. It hosts
 * the action-listener that registers providers.  Add this tag
 * to that page to enable token-replacement.
 *
 * @system data
 * @extension actions
 * @extension custom
 */
@Component({
  tag: 'n-data',
  shadow: true,
})
export class Data {
  private listener!: DataListener

  /**
   * Turn on debugging to get helpful messages from the
   * data action systems.
   */
  @Prop() debug = false

  /**
   * The wait-time, in seconds to wait for
   * un-registered data providers found in an expression.
   * This is to accommodate a possible lag between
   * evaluation before the first predicate
   * and the registration process.
   */
  @Prop() providerTimeout?: number

  componentWillLoad() {
    debugIf(this.debug, `n-data: registering data listener`)

    this.listener = new DataListener()
    dataState.enabled = true

    if (this.providerTimeout)
      dataState.providerTimeout = this.providerTimeout

    this.listener.initialize(window, actionBus, eventBus)
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
    clearDataProviders()
  }
}
