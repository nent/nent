import { Component, Element, h, Host, Prop } from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { debugIf, warn } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { VideoActionListener } from './video/actions'
import { videoState } from './video/state'
import { VideoTimer } from './video/timer'
/**
 * This component enables th UI services. These are typically
 * web component plug-ins to manage things like Modals, Drawers,
 * menus, etc. The basic provider is used to toggle dark-mode.
 *
 * @system video
 * @extension actions
 */
@Component({
  tag: 'n-video',
  shadow: false,
})
export class Video {
  private listener!: VideoActionListener
  @Element() el!: HTMLNVideoElement

  /**
   * Provide the element selector for the media object that can provide
   * time-updates and media-end events.
   */
  @Prop() targetElement: string = 'video'

  /**
   * Provide the time-event name.
   * Default is timeupdate
   */
  @Prop() timeEvent: string = 'timeupdate'

  /**
   * Provide the element property name that
   * holds the current time in seconds.
   * Default is currentTime
   */
  @Prop() timeProperty: string = 'currentTime'

  /**
   * Provide the element property name that
   * holds the duration time in seconds.
   * Default is duration
   */
  @Prop() durationProperty: string = 'duration'

  /**
   * Provider the end event name.
   * Default is ended
   */
  @Prop() endEvent: string = 'ended'

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  /**
   * Normalized video event timer.
   */
  @Prop({ mutable: true }) timer?: VideoTimer

  private get childVideo(): HTMLMediaElement | null {
    return this.el.querySelector(this.targetElement)
  }

  async componentWillLoad() {
    debugIf(commonState.debug, `n-video: loading`)

    const video = this.childVideo
    if (video == null) {
      warn(`n-video: no child video element was found`)
      return
    }

    this.timer = new VideoTimer(
      video,
      this.timeEvent,
      this.timeProperty,
      this.durationProperty,
      this.endEvent,
    )
    this.listener = new VideoActionListener(
      video,
      eventBus,
      actionBus,
      this.debug,
    )

    const self = this
    this.timer.destroy = () => {
      self.childVideo?.pause?.call(self)
      self.timer?.removeAllListeners?.call(self.timer)
    }
  }

  async componentDidRender() {
    const video = this.childVideo
    if (video == null) return

    if (videoState.autoplay) {
      await video.play?.call(this)
    }
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    this.listener?.destroy()
    this.timer?.destroy()
  }
}
