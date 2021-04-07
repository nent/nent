import { EventAction } from '../../../services/actions/interfaces'
import { debugIf, IEventEmitter } from '../../../services/common'
import {
  VIDEO_COMMANDS,
  VIDEO_EVENTS,
  VIDEO_TOPIC,
} from './interfaces'

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

  public async play() {
    await this.childVideo?.play?.call(this)
    this.eventBus.emit(VIDEO_EVENTS.Played)
  }

  public pause() {
    this.childVideo?.pause?.call(this)
    this.eventBus.emit(VIDEO_EVENTS.Paused)
  }

  public async resume() {
    await this.childVideo?.play?.call(this)
    this.eventBus.emit(VIDEO_EVENTS.Resumed)
  }

  destroy() {
    this.disposeHandle?.call(this)
  }
}
