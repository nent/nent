import { Component, Element, h, Host, Prop } from '@stencil/core'
import { warn } from '../../services/common/logging'
import { FrameTimer } from '../n-presentation-timer/services/timer'
import { navigationState } from '../n-views/services/state'
import { ITimer } from './services/interfaces'
import { PresentationService } from './services/presentation'

/**
 * This component encapsulates a timed presentation. This component uses
 * a child n-presentation-timer or n-video element to create time-events
 * then it delegates those events to time-based action-activators.
 *
 * If enabled, the n-attributes for time will also get processed. This
 * component also has the ability to go to the next route using the active
 * route's 'goNext' function.
 *
 * @system presentation
 * @extension elements
 *
 */
@Component({
  tag: 'n-presentation',
  shadow: false,
})
export class NPresentation {
  private presentation?: PresentationService
  @Element() el!: HTMLNPresentationElement

  /**
   * The timer instance for a manual timer.
   */
  @Prop({ mutable: true }) timer: ITimer | null = null

  /**
   * The element selector for the timer-element to
   * bind for interval events. If left blank, it looks
   * first an n-timer, then for the first n-video.
   *
   * If none are found, it creates on manually and starts
   * it immediately
   */
  @Prop() timerElement?: string

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  /**
   * Go to the next view after a given time if a number
   * is present, otherwise when the end-event occurs.
   */
  @Prop() nextAfter: number | boolean = false

  /**
   * Send analytics view-time percentages for this presentation
   * using the event name
   */
  @Prop() analytics?: string

  componentWillLoad() {
    let timerElement: any = this.timerElement
      ? this.el.querySelector(this.timerElement) ||
        this.el.ownerDocument.querySelector(this.timerElement) ||
        null
      : this.el.querySelector('n-presentation-timer') ||
        this.el.ownerDocument.querySelector('n-presentation-timer') ||
        this.el.ownerDocument.querySelector('n-video') ||
        null

    if (this.timerElement && !timerElement.timer) {
      warn(
        `n-presentation: the element at ${this.timerElement} does not have a valid timer.`,
      )
      return
    }

    this.timer =
      (timerElement?.timer as ITimer) ||
      new FrameTimer(window, 0, 0, this.debug)
  }

  render() {
    return <Host></Host>
  }

  componentDidRender() {
    if (this.timer) {
      this.presentation = new PresentationService(
        this.el,
        this.timer,
        navigationState.router?.exactRoute || null,
        this.debug,
        this.nextAfter,
        this.analytics,
      )

      this.presentation?.beginTimer()
    }
  }

  disconnectedCallback() {
    this.timer?.destroy()
    this.timer = null
    this.presentation?.cleanup()
    delete this.presentation
  }
}
