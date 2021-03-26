import { Component, h, Host, Prop } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { clearDataProviders } from '../../services/data/factory'
import { dataState } from '../../services/data/state'
import { DataListener } from './data/actions'

/**
 * This component enables the Data Provider system. It hosts
 * the action-listener that registers providers.  Add this tag
 * to that page to enable token-replacement.
 *
 * @actions true
 */
@Component({
  tag: 'n-data',
  shadow: true,
})
export class Data {
  private listener!: DataListener

  /**
   * The wait-time, in milliseconds to wait for
   * un-registered data providers found in an expression.
   * This is to accommodate a possible lag between
   * evaluation before the first view-do 'when' predicate
   * an the registration process.
   * @system data
   */
  @Prop() providerTimeout: number = 500

  componentWillLoad() {
    debugIf(
      commonState.debug,
      `n-data: Data services enabled. Data listener registered`,
    )

    this.listener = new DataListener()
    commonState.dataEnabled = true
    dataState.enabled = true
    dataState.providerTimeout = this.providerTimeout
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
