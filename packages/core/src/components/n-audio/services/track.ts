import { Listener, requireValue } from '../../../services/common'
import { warn } from '../../../services/common/logging'
import {
  AudioInfo,
  AudioType,
  AUDIO_EVENTS,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'

/* It's a wrapper around the Howler library that allows us to play audio files */
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

  /**
   * It creates a new Howl instance, and assigns it to the sound property of the AudioTrack instance
   * @param {AudioInfo} audio - AudioInfo
   * @param {Listener} [onEnd] - A callback function that is called when the audio track ends.
   */
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

  /**
   * It returns a boolean value that indicates whether the sound is currently playing
   * @returns The sound is being returned.
   */
  public playing() {
    return this.sound.playing()
  }

  /**
   * It returns true if the volume of the sound is 0, and false otherwise
   * @returns The volume of the sound.
   */
  public muted() {
    return this.sound.volume() == 0
  }

  /**
   * It returns the state of the sound
   * @returns The state of the sound object.
   */
  public state() {
    return this.sound.state()
  }

  /**
   * If the sound is loaded, play it. If it's loading, wait for it to load and then play it
   */
  public start() {
    if (this.sound.state() === 'loaded') {
      this.play()
    } else if (this.sound.state() === 'loading') {
      this.sound.once(AUDIO_EVENTS.Loaded, () => {
        this.play()
      })
    }
  }

  /**
   * "Play the sound, but fade it in over half a second."
   *
   * The first line sets the volume to 0. This is important because if we don't do this, the sound will
   * play at full volume for a split second before fading in
   */
  public play() {
    this.sound.volume(0)
    this.sound.play()
    this.sound.fade(0, window.Howler?.volume() || 0.5, 500)
  }

  /**
   * It pauses the sound
   */
  public pause() {
    this.sound.pause()
  }

  /**
   * It fades the volume of the sound to 0 over 500 milliseconds, then stops the sound
   */
  public stop() {
    this.sound.fade(window.Howler?.volume() || 0.5, 0, 500)
    this.sound.stop()
  }

  /**
   * It sets the mute property of the sound object to the value of the mute parameter
   * @param {boolean} mute - boolean - true to mute, false to unmute
   */
  public mute(mute: boolean) {
    this.sound.mute(mute)
  }

  /**
   * The resume function plays the sound
   */
  public resume() {
    this.sound.play()
  }

  /**
   * This function sets the volume of the sound to the number passed in
   * @param {number} set - The volume you want to set the sound to.
   */
  public setVolume(set: number) {
    this.sound.volume(set)
  }

  /**
   * This function seeks to a specific time in the audio file
   * @param {number} time - The time in seconds to seek to.
   */
  public seek(time: number) {
    this.sound.seek(time)
  }

  /**
   * It unloads the sound from the game.
   */
  public destroy() {
    this.sound.unload()
  }
}
