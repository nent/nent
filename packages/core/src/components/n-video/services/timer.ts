import { EventEmitter } from '../../../services/common/emitter'
import { debugIf, warn } from '../../../services/common/logging'
import {
  ITimer,
  TimeDetails,
  TIMER_EVENTS,
} from '../../n-presentation/services/interfaces'
import { getTimeDetails } from '../../n-presentation/services/time'

export class VideoTimer extends EventEmitter implements ITimer {
  public durationSeconds: number = 0
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

  begin(): void {
    try {
      this.video.play?.call(this.video)
    } catch (error) {}
  }

  stop(): void {
    this.video.pause?.call(this.video)
  }

  destroy() {
    this.stop()
    this.removeAllListeners()
  }
}
