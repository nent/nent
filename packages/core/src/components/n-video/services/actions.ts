import { EventAction } from '../../../services/actions/interfaces'
import { debugIf, IEventEmitter } from '../../../services/common'
import {
  VIDEO_COMMANDS,
  VIDEO_EVENTS,
  VIDEO_TOPIC,
} from './interfaces'

/* It listens to the `VIDEO_TOPIC` topic on the `actionBus` and executes the command on the
`childVideo` element */
export class VideoActionListener {
  private disposeHandle: () => void
  constructor(
    private childVideo: HTMLMediaElement,
    private eventBus: IEventEmitter,
    private actionBus: IEventEmitter,
    private debug: boolean,
  ) {
    this.disposeHandle = this.actionBus.on(
      VIDEO_TOPIC,
      async (ev: EventAction<any>) => {
        debugIf(
          this.debug,
          `n-video actions: event received ${ev.topic}:${ev.command}`,
        )
        await this.commandReceived(ev.command, ev.data)
      },
    )
  }

  private async commandReceived(command: string, data: any) {
    switch (command) {
      case VIDEO_COMMANDS.Play: {
        await this.play()
        break
      }

      case VIDEO_COMMANDS.Pause: {
        this.pause()
        break
      }

      case VIDEO_COMMANDS.Resume: {
        await this.resume()
        break
      }

      case VIDEO_COMMANDS.Mute: {
        this.mute(data.value)
        break
      }

      default:
    }
  }

  /**
   * If the child video exists, set the child video's muted property to the value of the muted
   * parameter, and if muted is true, emit the Muted event, otherwise emit the Unmuted event
   * @param {boolean} muted - boolean - true if you want to mute the video, false if you want to unmute
   * it.
   * @returns the value of the childVideo.muted property.
   */
  public mute(muted: boolean) {
    if (!this.childVideo) {
      return
    }

    this.childVideo.muted = muted
    if (muted) {
      this.eventBus.emit(VIDEO_EVENTS.Muted)
    } else {
      this.eventBus.emit(VIDEO_EVENTS.Unmuted)
    }
  }

  /**
   * It plays the video.
   */
  public async play() {
    await this.childVideo?.play?.call(this)
    this.eventBus.emit(VIDEO_EVENTS.Played)
  }

  /**
   * If the childVideo object has a pause method, call it
   */
  public pause() {
    this.childVideo?.pause?.call(this)
    this.eventBus.emit(VIDEO_EVENTS.Paused)
  }

  /**
   * It resumes the video.
   */
  public async resume() {
    await this.childVideo?.play?.call(this)
    this.eventBus.emit(VIDEO_EVENTS.Resumed)
  }

  /**
   * If the `disposeHandle` property is not null, then call the function that it points to, passing in
   * the current instance of the class
   */
  destroy() {
    this.disposeHandle?.call(this)
  }
}
