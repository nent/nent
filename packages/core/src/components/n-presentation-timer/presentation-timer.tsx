import { Component, Element, h, Host, Prop } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import {
  IElementTimer,
  ITimer,
} from '../n-presentation/services/interfaces'
import { FrameTimer } from './services/timer'
@Component({
  tag: 'n-presentation-timer',
  shadow: false,
})
export class NPresentationTimer implements IElementTimer {
  @Element() el!: HTMLNPresentationTimerElement
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
   * Timer start time.
   */
  @Prop() start: number = 0

  componentWillLoad() {
    debugIf(this.debug, `n-presentation-timer: loading`)
    this.timer = new FrameTimer(
      window,
      this.duration,
      this.start,
      this.debug,
    )
  }

  render() {
    return <Host></Host>
  }

  componentDidRender() {
    this.timer.begin()
  }

  disconnectedCallback() {
    this.timer.destroy()
  }
}
