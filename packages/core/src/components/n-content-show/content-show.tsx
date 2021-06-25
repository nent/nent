import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { ComponentRefresher } from '../../services/common'
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'

/**
 * This element conditionally renders child elements based on the
 * configured predicate applied to the when value predicate.
 * To learn more about predicates, check out the
 * expressions documentation.
 *
 * @system content
 * @extension data
 */
@Component({
  tag: 'n-content-show',
  shadow: true,
})
export class ContentShow {
  @Element() el!: HTMLNContentShowElement
  private dataSubscription!: ComponentRefresher
  private routeSubscription!: ComponentRefresher
  @State() show = true

  /**
   The data expression to obtain a predicate for conditionally rendering
   the inner-contents of this element.
   */
  @Prop() when!: string

  componentWillLoad() {
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
  }

  async componentWillRender() {
    this.show = await evaluatePredicate(this.when)
  }

  disconnectedCallback() {
    this.dataSubscription.destroy()
    this.routeSubscription.destroy()
  }

  render() {
    return (
      <Host hidden={!this.show}>
        <slot />
      </Host>
    )
  }
}
