import { Component, Host, h } from '@stencil/core';

/**
 * This component should surround the inner-content of a remote HTML file that can be prioritized during SPA navigation.
 *
 * @system content
 */
@Component({
  tag: 'n-content',
  shadow: false,
  styles: 'n-content: { display: contents; }'
})
export class Content {

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }

}
