import { Component, Element, h, Prop, State } from '@stencil/core'
import { routingState } from '../n-views/services/state'

/**
 *
 * @system routing
 */
@Component({
  tag: 'n-view-link-back',
  styles: 'n-view-link-back { display: inline-block; }',
  shadow: false,
})
export class ViewLinkBack {
  @Element() el!: HTMLNViewLinkBackElement
  @State() route = routingState.exactRoute?.previousRoute
  private title?: string

  /**
   * The link text
   */
  @Prop() text?: string

  /**
   * The class to add to the anchor tag.
   */
  @Prop() linkClass?: string

  async componentWillRender() {
    this.title =
      await routingState.exactRoute?.previousRoute?.resolvedTitle()
  }

  render() {
    const route = routingState.exactRoute?.previousRoute
    const title = this.text || this.title || route?.title || 'Back'
    return (
      <a
        class={this.linkClass}
        onClick={e => {
          e.preventDefault()
          routingState.exactRoute?.goBack()
        }}
        onKeyPress={e => {
          e.preventDefault()
          routingState.exactRoute?.goBack()
        }}
        href={route?.path}
        title={title}
        n-attached-click
        n-attached-key-press
      >
        {title}
      </a>
    )
  }
}
