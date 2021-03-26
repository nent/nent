import { EventEmitter } from '../../../services/common/emitter'
import { warn } from '../../../services/common/logging'
import {
  IViewDoTimer,
  TimeDetails,
  TIMER_EVENTS,
} from '../../n-view-prompt/services/interfaces'
import { getTimeDetails } from '../../n-view-prompt/services/time'

export class VideoTimer extends EventEmitter implements IViewDoTimer {
  constructor(
    private video: HTMLMediaElement | any,
    private timeEvent: string = 'timeupdate',
    private timeProperty: string = 'currentTime',
    private durationProperty: string = 'duration',
    private endEvent: string = 'ended',
  ) {
    super()

    if (video == null) {
      warn(`n-video|timer: a media element is required`)
      return
    }

    const duration = Number(video[this.durationProperty] || 0)
    const start = 0

    video.addEventListener(this.timeEvent, () => {
      const currentTime = Number(this.video[this.timeProperty] || 0)
      this.currentTime = getTimeDetails(
        start,
        currentTime * 1000,
        duration,
      )
      this.emit(TIMER_EVENTS.OnInterval, this.currentTime)
    })

    video.addEventListener(this.endEvent, () => {
      this.emit(TIMER_EVENTS.OnEnd)
    })

    this.currentTime = getTimeDetails(0, 0, video.duration)
  }

  currentTime!: TimeDetails

  begin(): void {
    this.video.play?.call(this.video)
  }

  destroy() {
    this.video.pause?.call(this.video)
    this.removeAllListeners()
  }
}
