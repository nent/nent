import { debugIf, EventEmitter } from '../../../services/common'
import {
  ITimer,
  TimeDetails,
  TIMER_EVENTS,
} from '../../n-presentation/services/interfaces'
import { getTimeDetails } from '../../n-presentation/services/time'

export class FrameTimer extends EventEmitter implements ITimer {
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
      `presentation-timer: starting timer w/ ${duration} duration`,
    )
    this.currentTime = getTimeDetails(start, 0, duration)
  }
  currentTime: TimeDetails

  begin(): ITimer {
    this.start = performance.now()
    this.currentTime.elapsed = 0
    this.timer = this.provider.requestAnimationFrame(current => {
      this.interval(current)
    })
    return this
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
        `presentation-timer: timer ended at ${time}`,
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
