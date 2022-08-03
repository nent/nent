import { EventEmitter } from '../../../services/common/emitter'
import { debugIf, warn } from '../../../services/common/logging'
import {
  ITimer,
  TimeDetails,
  TIMER_EVENTS,
} from '../../n-presentation/services/interfaces'
import { getTimeDetails } from '../../n-presentation/services/time'

/* It creates a timer that emits events based on the current time of a video element */
export class VideoTimer extends EventEmitter implements ITimer {
  public durationSeconds: number = 0
  /**
   * It creates a new instance of the `VideoTimer` class, which is a subclass of `EventEmitter`
   * @param {HTMLMediaElement | any} video - HTMLMediaElement | any
   * @param {string} [timeEvent=timeupdate] - the event that is fired when the video's current time
   * changes.
   * @param {string} [timeProperty=currentTime] - the property on the video element that contains the
   * current time
   * @param {string} [durationProperty=duration] - The property on the video element that contains the
   * duration of the video.
   * @param {string} [endEvent=ended] - The event that is emitted when the video ends.
   * @param {boolean} [debug=false] - boolean - if true, will log to the console
   * @returns A new instance of the VideoTimer class.
   */
  constructor(
    private video: HTMLMediaElement | any,
    private timeEvent: string = 'timeupdate',
    private timeProperty: string = 'currentTime',
    private durationProperty: string = 'duration',
    private endEvent: string = 'ended',
    private debug: boolean = false,
  ) {
    super()

    if (video == null) {
      warn(`n-video-timer: a media element is required`)
      return
    }
    this.durationSeconds = Number(video[this.durationProperty] || 0)
    const start = 0

    debugIf(
      this.debug,
      `n-video-timer: creating video timer with duration ${this.durationSeconds}`,
    )

    video.addEventListener(this.timeEvent, () => {
      const currentTime = Number(video[this.timeProperty] || 0)
      this.currentTime = getTimeDetails(
        start,
        currentTime * 1000,
        this.durationSeconds * 1000,
      )
      this.emit(TIMER_EVENTS.OnInterval, this.currentTime)
    })

    video.addEventListener(this.endEvent, () => {
      this.emit(TIMER_EVENTS.OnEnd)
    })

    this.currentTime = getTimeDetails(
      0,
      0,
      this.durationSeconds * 1000,
    )
  }

  currentTime!: TimeDetails

  /**
   * It calls the play method on the video element
   */
  public begin(): void {
    try {
      this.video.play?.call(this.video)
    } catch (error) {}
  }

  /**
   * It pauses the video.
   */
  public stop(): void {
    this.video.pause?.call(this.video)
  }

  /**
   * It stops the timer and removes all listeners.
   */
  public destroy() {
    this.stop()
    this.removeAllListeners()
  }
}
