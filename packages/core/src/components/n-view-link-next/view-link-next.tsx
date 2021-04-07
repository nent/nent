import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'n-view-link-next',
  styles: 'n-view-link-next { display: inline-block; }',
  shadow: false,
})
export class NViewLinkNext {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }
}
