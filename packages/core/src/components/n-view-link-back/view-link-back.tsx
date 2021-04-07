import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'n-view-link-back',
  styles: 'n-view-link-back { display: inline-block; }',
  shadow: false,
})
export class NViewLinkBack {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }
}
