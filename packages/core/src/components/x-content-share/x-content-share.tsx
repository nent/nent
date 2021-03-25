/* istanbul ignore file */
/** Untestable at the moment */
import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
} from '@stencil/core'

/**
 * This component leverages the browser's web-share
 * API to give the application a native-app feel.
 * @system content
 */
@Component({
  tag: 'x-content-share',
  styleUrl: 'x-content-share.css',
  shadow: true,
})
export class XContentShare {
  @Element() el!: HTMLXContentShareElement
  /**
   * Headline for the share
   */
  @Prop() headline?: string

  /**
   * The textual body of web share
   */
  @Prop() text?: string

  /**
   * The URL we are sharing
   */
  @Prop() url?: string

  componentWillLoad() {
    if (!this.url) {
      let url = document.location.href
      const canonicalElement = document.querySelector(
        'link[rel=canonical]',
      ) as HTMLLinkElement
      if (canonicalElement) {
        url = canonicalElement.href
      }
    }
  }

  /**
   * Manual share method for more complex scenarios
   * @param data
   */
  @Method()
  public async share(
    data?: {
      title?: string
      text?: string
      url?: string
    } | null,
  ) {
    if (navigator?.share) {
      await navigator.share({
        title: data?.title || this.headline || document.title,
        text: data?.text || this.text,
        url: data?.url || this.url,
      })
    }
  }

  render() {
    return (
      <Host onClick={async () => await this.share()}>
        <slot></slot>
      </Host>
    )
  }
}
