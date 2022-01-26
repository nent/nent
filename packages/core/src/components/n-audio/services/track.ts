import { Listener, requireValue } from '../../../services/common'
import { warn } from '../../../services/common/logging'
import {
  AudioInfo,
  AudioType,
  AUDIO_EVENTS,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'

export class AudioTrack implements AudioInfo {
  public readonly sound!: Howl
  public trackId!: string
  public type!: AudioType
  public src!: string
  public mode!: LoadStrategy
  public discard: DiscardStrategy = DiscardStrategy.route
  public loop: boolean = false

  public onEnd?: Listener
  public onLoad?: Listener
  public playing() {
    return this.sound.playing()
  }

  public muted() {
    return this.sound.volume() == 0
  }

  public state() {
    return this.sound.state()
  }

  constructor(audio: AudioInfo, onEnd?: Listener) {
    const { trackId, src, type, loop } = audio
    requireValue(trackId, 'trackId', 'n-audio: track')
    requireValue(src, 'src', 'n-audio: track')
    requireValue(type, 'type', 'n-audio: track')

    Object.assign(this, audio, {
      onEnd,
    })

    const sound = new Howl({
      src,
      loop: type === 'music' ? loop : false,
      onload: () => {
        this.onLoad?.call(this, this)
      },
      onend: () => {
        onEnd?.call(this, this)
      },
      onloaderror: (_id, error) => {
        warn(
          `n-audio: An error occurred for audio track ${trackId}: ${error}`,
        )
        onEnd?.call(this)
      },
      onplayerror: () => {
        sound.once('unlock', () => {
          sound.play()
        })
      },
      preload: true,
      autoplay: false,
      html5: false,
    })

    this.sound = sound
  }

  public start() {
    if (this.sound.state() === 'loaded') {
      this.play()
    } else if (this.sound.state() === 'loading') {
      this.sound.once(AUDIO_EVENTS.Loaded, () => {
        this.play()
      })
    }
  }

  public play() {
    this.sound.volume(0)
    this.sound.play()
    this.sound.fade(0, window.Howler?.volume() || 0.5, 500)
  }

  public pause() {
    this.sound.pause()
  }

  public stop() {
    this.sound.fade(window.Howler?.volume() || 0.5, 0, 500)
    this.sound.stop()
  }

  public mute(mute: boolean) {
    this.sound.mute(mute)
  }

  public resume() {
    this.sound.play()
  }

  public setVolume(set: number) {
    this.sound.volume(set)
  }

  public seek(time: number) {
    this.sound.seek(time)
  }

  public destroy() {
    this.sound.unload()
  }
}
