import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import {
  IElementTimer,
  ITimer,
} from '../n-presentation/services/interfaces'
import { FrameTimer } from './services/timer'

/**
 * This element creates a timer for the presentation
 * element to use in place of a video, to time actions
 * or manipulate HTML by time.
 *
 * @system presentation
 */
@Component({
  tag: 'n-presentation-timer',
  shadow: false,
})
export class PresentationTimer implements IElementTimer {
  @Element() el!: HTMLNPresentationTimerElement
  @State() elapsed: number = 0
  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  /**
   * Normalized timer.
   */
  @Prop({ mutable: true }) timer!: ITimer

  /**
   * Duration before the timer stops and raises
   * the ended event. 0 = never
   */
  @Prop() duration: number = 0

  /**
   * Interval in milliseconds to request
   * between the getAnimationFrame. This
   * affects the precision.
   */
  @Prop() interval: number = 200

  /**
   * Display elapsed seconds
   */
  @Prop() display: boolean = false

  /**
   * Ready event letting the presentation layer know it can
   * begin.
   */
  @Event({
    eventName: 'ready',
  })
  ready!: EventEmitter

  /**
   * Begin the timer. This is called automatically
   * by the presentation element.
   */
  @Method()
  async begin() {
    this.timer?.begin()
  }

  componentWillLoad() {
    this.timer = new FrameTimer(
      window,
      this.interval,
      this.duration,
      () => performance.now(),
      () => {
        this.elapsed = this.timer.currentTime.elapsed
      },
      this.debug,
    )
    this.ready.emit(true)
  }

  render() {
    return <Host>{this.display ? this.elapsed : null}</Host>
  }

  disconnectedCallback() {
    this.timer.destroy()
  }
}
