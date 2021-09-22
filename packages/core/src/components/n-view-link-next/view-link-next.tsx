import { Component, Element, h, Prop, State } from '@stencil/core'
import { routingState } from '../n-views/services/state'

/**
 * This element will automatically go to the next
 * view in the view.
 * @system routing
 */
@Component({
  tag: 'n-view-link-next',
  styles: 'n-view-link-next { display: inline-block; }',
  shadow: false,
})
export class ViewLinkNext {
  @Element() el!: HTMLNViewLinkNextElement
  @State() route = routingState.exactRoute?.nextRoute
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
    this.title = await this.route?.nextRoute?.resolvedTitle()
  }

  render() {
    const route = routingState.exactRoute?.nextRoute
    const title = this.text || this.title || route?.title || 'Next'
    return (
      <a
        class={this.linkClass}
        onClick={e => {
          e.preventDefault()
          routingState.exactRoute?.goNext()
        }}
        onKeyPress={e => {
          e.preventDefault()
          routingState.exactRoute?.goNext()
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
