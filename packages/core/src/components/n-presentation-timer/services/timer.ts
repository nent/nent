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

/* It's a timer that uses the browser's animation frame to emit events at a given interval */
export class FrameTimer extends EventEmitter implements ITimer {
  private timer: number = 0
  private start: number = 0
  private durationMs: number = 0
  debouncedInterval: Function
  /**
   * It creates a new timer object that will fire an event every `interval` milliseconds, and will fire
   * a final event when the timer has run for `durationSeconds`
   * @param {AnimationFrameProvider} provider - AnimationFrameProvider
   * @param {number} interval - The interval at which to emit the current time.
   * @param {number} durationSeconds - The duration of the timer in seconds.
   * @param getStart - () => number = performance.now,
   * @param {null | (() => void)} [onInterval=null] - a callback that will be called every interval
   * milliseconds.
   * @param {boolean} [debug=false] - boolean - if true, will log to console.log
   */
  constructor(
    private provider: AnimationFrameProvider,
    private interval: number,
    public durationSeconds: number,
    public getStart: () => number = performance.now,
    private onInterval: null | (() => void) = null,
    private debug: boolean = false,
  ) {
    super()
    this.durationMs = this.durationSeconds * 1000
    debugIf(
      this.debug,
      `presentation-timer: starting timer w/ ${this.durationSeconds} duration`,
    )
    this.currentTime = getTimeDetails(
      this.start,
      this.start,
      this.durationMs,
    )

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

  /**
   * We start the timer by setting the start time, and then we call the `doInterval` function
   */
  public begin() {
    if (this.timer) this.stop()
    this.start = this.getStart()
    this.currentTime = getTimeDetails(
      this.start,
      this.start,
      this.durationMs,
    )

    this.provider.requestAnimationFrame(async current => {
      await this.doInterval(current)
    })
  }

  /**
   * It stops the animation by cancelling the requestAnimationFrame
   */
  public stop(): void {
    this.provider.cancelAnimationFrame(this.timer)
  }

  private async doInterval(time: number) {
    this.currentTime = getTimeDetails(
      this.start,
      time,
      this.durationMs,
    )
    if (this.currentTime.ended) {
      this.stop()
      this.emit(TIMER_EVENTS.OnEnd, this.currentTime)
    } else {
      this.emit(TIMER_EVENTS.OnInterval, this.currentTime)
      await this.debouncedInterval()
    }
    this.onInterval?.call(this)
  }

  /**
   * It stops the timer and removes all listeners.
   */
  public destroy() {
    this.stop()
    this.removeAllListeners()
  }
}
