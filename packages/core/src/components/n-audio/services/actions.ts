import { EventAction } from '../../../services/actions/interfaces'
import {
  commonState,
  EventEmitter,
  IEventEmitter,
  onCommonStateChange,
} from '../../../services/common'
import { debugIf } from '../../../services/common/logging'
import { ROUTE_EVENTS } from '../../n-views/services/interfaces'
import {
  AudioInfo,
  AudioRequest,
  AudioType,
  AUDIO_COMMANDS,
  AUDIO_EVENTS,
  AUDIO_TOPIC,
  DiscardStrategy,
} from './interfaces'
import { MusicPlayer } from './player-music'
import { SoundPlayer } from './player-sound'
import { audioState } from './state'

export class AudioActionListener {
  changed: IEventEmitter
  private readonly stateSubscription: () => void
  private readonly actionSubscription: () => void
  private readonly eventSubscription: () => void

  public music!: MusicPlayer
  public sound!: SoundPlayer

  constructor(
    private readonly window: Window,
    private readonly eventBus: IEventEmitter,
    private readonly actionBus: IEventEmitter,
    private readonly debug: boolean = false,
  ) {
    this.changed = new EventEmitter()

    this.music = new MusicPlayer(() => {
      this.changed.emit('changed')
    })

    this.sound = new SoundPlayer(() => {
      this.changed.emit('changed')
    })

    this.volume = 1

    this.stateSubscription = onCommonStateChange(
      'audioEnabled',
      enabled => {
        if (enabled) this.enable()
        else this.disable()
        this.changed.emit('changed')
      },
    )

    this.actionSubscription = this.actionBus.on(
      AUDIO_TOPIC,
      async (ev: EventAction<any>) => {
        debugIf(
          this.debug,
          `audio-listener: action received ${ev.topic}:${ev.command}`,
        )
        await this.commandReceived(ev.command, ev.data)
      },
    )

    this.eventSubscription = this.eventBus.on(
      ROUTE_EVENTS.RouteChanged,
      () => {
        debugIf(this.debug, 'audio-listener: route changed received')
        this.music.discard(
          DiscardStrategy.route,
          DiscardStrategy.next,
        )
        this.sound.discard(
          DiscardStrategy.route,
          DiscardStrategy.next,
        )
      },
    )
  }

  // Public Members

  public enable() {
    commonState.audioEnabled = true
    this.changed.emit('changed')
  }

  public disable() {
    commonState.audioEnabled = false
    this.pause()
    try {
      this.window.Howler?.unload?.call(this)
    } catch {}
    this.changed.emit('changed')
  }

  public isPlaying(): boolean {
    return Boolean(
      this.music.active?.playing ||
        this.sound.active?.playing ||
        false,
    )
  }

  public hasAudio(): boolean {
    return this.music.hasAudio() || this.sound.hasAudio()
  }

  public pause() {
    this.music.pause()
    this.sound.pause()
    this.changed.emit('changed')
  }

  public play() {
    if (!commonState.audioEnabled) return
    this.music.play()
    this.sound.play()
    this.changed.emit('changed')
  }

  public stop() {
    this.music.stop()
    this.sound.stop()
    this.changed.emit('changed')
  }

  public resume() {
    if (!commonState.audioEnabled) return
    this.music.resume()
    this.sound.resume()
    this.changed.emit('changed')
  }

  public muted: boolean = false
  public mute(mute = !this.muted) {
    audioState.muted = mute
    this.music.mute(mute)
    this.sound.mute(mute)
    this.muted = mute
    this.changed.emit('changed')
  }

  public seek(type: AudioType, trackId: string, seek: number) {
    const current =
      type == AudioType.music ? this.music.active : this.sound.active
    if (current && current.trackId === trackId) {
      current.seek(seek)
      this.changed.emit('changed')
    }
  }

  public volume: number = 0
  public setVolume(value: number) {
    this.window.Howler?.volume(value)
    this.muted = value == 0
    this.volume = value
    this.changed.emit('changed')
  }

  // Private members

  private async commandReceived(
    command: string,
    data: AudioInfo | AudioRequest | boolean,
  ) {
    switch (command) {
      case AUDIO_COMMANDS.enable: {
        this.enable()
        break
      }

      case AUDIO_COMMANDS.disable: {
        this.disable()
        break
      }

      case AUDIO_COMMANDS.load: {
        const audio = data as AudioInfo
        const { type } = audio
        if (type == AudioType.sound) {
          this.sound.load(audio)
        } else if (type == AudioType.music) {
          this.music.load(audio)
        } else {
          return
        }
        this.eventBus.emit(
          AUDIO_TOPIC,
          AUDIO_EVENTS.Loaded,
          audio.trackId,
        )
        break
      }

      case AUDIO_COMMANDS.play: {
        const audio = data as AudioInfo
        const { type, trackId, src } = audio

        if (type == AudioType.music) {
          if (src) this.music.load(audio!)
          this.music.playTrack(trackId!)
        } else {
          if (src) this.sound.load(audio)
          this.sound.playTrack(trackId!)
        }
        this.eventBus.emit(AUDIO_TOPIC, AUDIO_EVENTS.Played, trackId)
        break
      }

      case AUDIO_COMMANDS.queue: {
        const audio = data as AudioInfo
        const { type, trackId } = audio
        if (type != AudioType.music) return
        this.music.queueAudio(audio)
        this.eventBus.emit(AUDIO_TOPIC, AUDIO_EVENTS.Queued, trackId)
        break
      }

      case AUDIO_COMMANDS.start: {
        const audio = data as AudioInfo
        const { type, trackId } = audio
        if (type == AudioType.music) {
          await this.music.playTrack(trackId!)
        } else if (type == AudioType.sound) {
          await this.sound.playTrack(trackId!)
        } else {
          return
        }
        this.eventBus.emit(AUDIO_TOPIC, AUDIO_EVENTS.Started, trackId)
        break
      }

      case AUDIO_COMMANDS.pause: {
        this.pause()
        break
      }

      case AUDIO_COMMANDS.resume: {
        this.resume()
        break
      }

      case AUDIO_COMMANDS.mute: {
        const { value } = data as AudioRequest
        this.mute(value)
        break
      }

      case AUDIO_COMMANDS.seek: {
        const audio = data as AudioRequest
        const { type, trackId, value } = audio
        if (trackId) {
          this.seek(type, trackId, value)
        }
        break
      }

      case AUDIO_COMMANDS.stop: {
        this.stop()
        break
      }

      case AUDIO_COMMANDS.volume: {
        const { value } = data as AudioRequest
        this.setVolume(value)
        break
      }

      default:
    }
  }

  destroy() {
    this.music.destroy()
    this.sound.destroy()
    this.eventSubscription()
    this.actionSubscription()
    this.stateSubscription()
  }
}
