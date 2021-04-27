import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
} from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { debugIf, warn } from '../../services/common/logging'
import {
  IElementTimer,
  ITimer,
} from '../n-presentation/services/interfaces'
import { VideoActionListener } from './services/actions'
import { VideoTimer } from './services/timer'
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
export class NVideo implements IElementTimer {
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
   * Provide the ready event name.
   * Default is ready
   */
  @Prop() readyEvent: string = 'ready'

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
  @Prop() debug: boolean = false

  /**
   * Normalized timer.
   */
  @Prop({ mutable: true }) timer!: ITimer

  /**
   * Ready event letting the presentation layer know it can
   * begin.
   */
  @Event({
    eventName: 'ready',
  })
  ready!: EventEmitter

  private get childVideo(): HTMLMediaElement | null {
    return this.el.querySelector(this.targetElement)
  }

  async componentWillLoad() {
    debugIf(this.debug, `n-video: loading`)

    const video = this.childVideo
    if (video == null) {
      warn(`n-video: no child video element was found`)
    } else {
      debugIf(
        this.debug,
        `n-video: listening to ${this.targetElement} for ${this.readyEvent}`,
      )
      video.addEventListener(this.readyEvent, async () => {
        debugIf(this.debug, `n-video: creating timer`)
        this.timer = new VideoTimer(
          video,
          this.timeEvent,
          this.timeProperty,
          this.durationProperty,
          this.endEvent,
          this.debug,
        )
        this.ready.emit(true)
      })

      debugIf(this.debug, `n-video: creating listener`)
      this.listener = new VideoActionListener(
        video,
        eventBus,
        actionBus,
        this.debug,
      )
    }
    debugIf(this.debug, `n-video: loaded`)
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    this.listener?.destroy()
    this.timer?.destroy()
  }
}
