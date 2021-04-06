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
import { evaluatePredicate } from '../../services/data/expressions'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { ROUTE_EVENTS } from '../../services/routing/interfaces'

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
  shadow: false,
})
export class ContentShow {
  @Element() el!: HTMLNContentShowElement
  private dataSubscription!: () => void
  private routeSubscription!: () => void
  @State() show = true

  /**
   The data expression to obtain a predicate for conditionally rendering
   the inner-contents of this element.
   */
  @Prop() when!: string

  componentWillLoad() {
    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      () => {
        forceUpdate(this)
      },
    )

    this.routeSubscription = eventBus.on(
      ROUTE_EVENTS.RouteChanged,
      () => {
        forceUpdate(this)
      },
    )
  }

  async componentWillRender() {
    this.show = await evaluatePredicate(this.when)
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.routeSubscription?.call(this)
  }

  render() {
    return (
      <Host hidden={!this.show}>
        <slot />
      </Host>
    )
  }
}
