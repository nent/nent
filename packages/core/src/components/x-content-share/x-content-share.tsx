/* istanbul ignore file */
/** Untestable at the moment */
import { Component, h, Host, Prop } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'

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
  @Prop() url?: string = window.location.href

  private share() {
    if ((navigator as any).share) {
      ;(navigator as any)
        .share({
          title: this.headline || 'Check this out',
          text: this.text,
          url: this.url,
        })
        .then(() => debugIf(commonState.debug, 'Successful share'))
        .catch((error: any) => error('Error sharing', error))
    } else {
      // fallback to sharing to twitter
      window.open(
        `http://twitter.com/share?text=${this.text}&url=${this.url}`,
      )
    }
  }

  render() {
    return (
      <Host title={this.headline} onClick={() => this.share()}>
        <slot>{this.text}</slot>
      </Host>
    )
  }
}
