import {
  debugIf,
  EventEmitter,
  throttle,
} from '../../../services/common'
import {
  ITimer,
  TimeDetails,
  TIMER_EVENTS,
} from '../../n-presentation/services/interfaces'
import { getTimeDetails } from '../../n-presentation/services/time'

export class FrameTimer extends EventEmitter implements ITimer {
  private timer: number = 0
  private start: number = 0
  debouncedInterval: Function
  constructor(
    private provider: AnimationFrameProvider,
    private interval: number,
    public duration: number,
    public getStart: () => number = performance.now,
    private onInterval: null | (() => void) = null,
    private debug: boolean = false,
  ) {
    super()
    this.start = this.getStart()

    debugIf(
      this.debug,
      `presentation-timer: starting timer w/ ${duration} duration`,
    )
    this.currentTime = getTimeDetails(0, 0, duration)

    if (this.interval > 0)
      this.debouncedInterval = throttle(
        this.interval,
        () => {
          this.timer = this.provider.requestAnimationFrame(
            current => {
              this.doInterval(current)
            },
          )
        },
        true,
        true,
      )
    else
      this.debouncedInterval = () => {
        this.timer = this.provider.requestAnimationFrame(current => {
          this.doInterval(current)
        })
      }
  }

  public currentTime: TimeDetails

  public begin() {
    if (this.timer) this.stop()
    this.start = this.getStart()
    this.currentTime = getTimeDetails(this.start, 0, this.duration)
    this.provider.requestAnimationFrame(current => {
      this.doInterval(current)
    })
  }

  public stop(): void {
    this.provider.cancelAnimationFrame(this.timer)
  }

  private async doInterval(time: number) {
    let currentTime = getTimeDetails(this.start, time, this.duration)
    if (this.duration > 0 && currentTime.elapsed > this.duration) {
      this.stop()
      this.currentTime = getTimeDetails(
        this.start,
        this.duration * 1000,
        this.duration,
      )
      this.emit(TIMER_EVENTS.OnEnd, this.currentTime)
    } else {
      this.currentTime = currentTime
      this.emit(TIMER_EVENTS.OnInterval, this.currentTime)
      await this.debouncedInterval()
    }
    this.onInterval?.call(this)
  }

  destroy() {
    this.stop()
    this.removeAllListeners()
  }
}
