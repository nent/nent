import { Component, h, Host, Prop } from '@stencil/core'
import { videoState } from '../x-video/video/state'

@Component({
  tag: 'x-video-autoplay',
  shadow: false,
})
export class XVideoAutoplay {
  /**
   * Controls the video auto-play setting.
   */
  @Prop() enabled: boolean = true

  componentWillLoad() {
    videoState.autoplay = this.enabled
  }

  render() {
    return <Host></Host>
  }
}
