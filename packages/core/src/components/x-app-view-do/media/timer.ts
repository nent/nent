import { debugIf, EventEmitter } from '../../../services/common'
import { IViewDoTimer, TimeDetails, TIMER_EVENTS } from './interfaces'
import { getTimeDetails } from './time'

export class ElementTimer
  extends EventEmitter
  implements IViewDoTimer {
  private timer: number = 0
  constructor(
    private provider: AnimationFrameProvider,
    public duration: number = 0,
    public start = performance.now(),
    private debug: boolean = false,
  ) {
    super()

    debugIf(
      this.debug,
      `element-timer: starting timer w/ ${duration} duration`,
    )
    this.currentTime = getTimeDetails(start, 0, duration)
  }
  currentTime: TimeDetails

  begin(): void {
    this.timer = this.provider.requestAnimationFrame(current => {
      this.interval(current)
    })
  }

  private interval(time: number) {
    const updatedTime = getTimeDetails(
      this.start,
      time,
      this.duration,
    )

    if (this.duration && updatedTime.elapsed > this.duration) {
      debugIf(
        this.debug,
        `element-timer: presentation ended at ${time} [not redirecting]`,
      )
      this.provider.cancelAnimationFrame(this.timer)
      this.emit(TIMER_EVENTS.OnEnd)
    } else {
      this.currentTime = updatedTime
      this.emit(TIMER_EVENTS.OnInterval, this.currentTime)
      this.timer = this.provider.requestAnimationFrame(current => {
        this.interval(current)
      })
    }
  }

  destroy() {
    this.removeAllListeners()
    try {
      this.provider.cancelAnimationFrame(this.timer)
    } catch {}
  }
}
