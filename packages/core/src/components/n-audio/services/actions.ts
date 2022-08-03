import { EventAction } from '../../../services/actions/interfaces'
import {
  commonState,
  EventEmitter,
  IEventEmitter,
  onCommonStateChange,
} from '../../../services/common'
import { debugIf } from '../../../services/common/logging'
import {
  addDataProvider,
  removeDataProvider,
} from '../../../services/data/factory'
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
import { AudioDataProvider } from './provider'
import { audioState, onAudioStateChange } from './state'

/* It listens for audio commands and events, and then plays the audio */
export class AudioActionListener {
  changed: IEventEmitter
  private stateEnabledSubscription!: () => void
  private stateDataSubscription!: () => void
  private stateMutedSubscription!: () => void
  private actionSubscription?: () => void
  private eventSubscription?: () => void

  public music!: MusicPlayer
  public sound!: SoundPlayer
  public provider?: AudioDataProvider

  /**
   * "This function is called when the class is instantiated, and it sets up the music and sound
   * players, and subscribes to the event bus."
   *
   * The first thing we do is create a new EventEmitter called "changed". This is used to notify the
   * rest of the app that the audio state has changed
   * @param {Window} window - Window - the window object
   * @param {IEventEmitter} eventBus - This is the event bus that the game uses to communicate with the
   * game engine.
   * @param {IEventEmitter} actionBus - IEventEmitter - this is the event bus that is used to send
   * actions to the game.
   * @param {boolean} enableDataProvider - boolean - whether to enable the data provider
   * @param {boolean} [debug=false] - boolean - if true, will log all events to the console
   */
  constructor(
    private readonly window: Window,
    private readonly eventBus: IEventEmitter,
    private readonly actionBus: IEventEmitter,
    private readonly enableDataProvider: boolean,
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

    this.stateEnabledSubscription = onCommonStateChange(
      'audioEnabled',
      enabled => {
        if (enabled) this.subscribe()
        else this.unsubscribe()
      },
    )

    if (commonState.audioEnabled) this.subscribe()
  }

  private subscribe() {
    const enableDataProvider = () => {
      if (this.enableDataProvider && this.provider == undefined) {
        this.provider = new AudioDataProvider(this)
        addDataProvider('audio', this.provider)
      }
    }
    if (commonState.audioEnabled) enableDataProvider()

    this.stateDataSubscription = onCommonStateChange(
      'dataEnabled',
      enabled => {
        if (enabled) {
          enableDataProvider()
        } else {
          removeDataProvider('audio')
          this.provider?.destroy()
          this.provider = undefined
        }
      },
    )

    if (audioState.muted) this.mute()
    this.stateMutedSubscription = onAudioStateChange(
      'muted',
      mute => {
        if (mute) this.mute()
        else this.play()
      },
    )

    this.actionSubscription = this.actionBus.on(
      AUDIO_TOPIC,
      async (ev: EventAction<any>) => {
        debugIf(
          this.debug,
          `audio-listener: action received ${ev.command}${
            ev.data?.type || ''
          }:${ev.data?.trackId || ''}`,
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

    this.changed.emit('changed')
  }

  private unsubscribe() {
    this.eventSubscription?.call(this)
    this.actionSubscription?.call(this)
    this.stateDataSubscription?.call(this)
    this.stateMutedSubscription?.call(this)
    this.music.destroy()
    this.sound.destroy()

    if (this.provider) {
      removeDataProvider('audio')
      this.provider.destroy()
    }
    this.changed.emit('changed')
  }

  // Public Members

  /**
   * `return Boolean(this.music.active?.playing() || this.sound.active?.playing() || false)`
   *
   * The `Boolean()` function is a JavaScript function that returns a boolean value.
   *
   * The `this.music.active?.playing()` is a TypeScript null-safe operator. It's a way to check if the
   * `active` property of the `music` object is not null. If it's not null, then it will return the
   * `playing()` function. If it is null, then it will return null.
   *
   * The `this.sound.active?.playing()` is the same as the above, but for the `sound` object.
   *
   * The `||` is a JavaScript operator that returns the first value that is not null.
   *
   * The `false` is a JavaScript boolean value.
   *
   * So, if the `music` object is not
   * @returns Boolean
   */
  public isPlaying(): boolean {
    return Boolean(
      this.music.active?.playing() ||
        this.sound.active?.playing() ||
        false,
    )
  }

  /**
   * It returns true if the music or sound has audio.
   * @returns A boolean value.
   */
  public hasAudio(): boolean {
    return this.music.hasAudio() || this.sound.hasAudio()
  }

  /**
   * It pauses the music and sound, and then emits a changed event
   */
  public pause() {
    this.music.pause()
    this.sound.pause()
    this.changed.emit('changed')
  }

  /**
   * If the audio is enabled, play the music and sound, and emit a changed event
   * @returns the value of the function.
   */
  public play() {
    if (!commonState.audioEnabled) return
    this.music.play()
    this.sound.play()
    this.changed.emit('changed')
  }

  /**
   * It stops the music and sound, and then emits a changed event
   */
  public stop() {
    this.music.stop()
    this.sound.stop()
    this.changed.emit('changed')
  }

  /**
   * It resumes the music and sound effects if audio is enabled
   * @returns the value of the expression.
   */
  public resume() {
    if (!commonState.audioEnabled) return
    this.music.resume()
    this.sound.resume()
    this.changed.emit('changed')
  }

  public muted: boolean = false
  /**
   * It sets the audioState.muted property to the value of the mute parameter, and then sets the muted
   * property of the music and sound objects to the value of the mute parameter, and then sets the
   * muted property of the AudioManager object to the value of the mute parameter, and then emits the
   * changed event
   * @param mute - boolean - Whether to mute or unmute the audio.
   */
  public mute(mute = !this.muted) {
    audioState.muted = mute
    this.music.mute(mute)
    this.sound.mute(mute)
    this.muted = mute
    this.changed.emit('changed')
  }

  /**
   * If the current track is the one we want to seek, then seek it
   * @param {AudioType} type - AudioType - This is the type of audio you want to seek.
   * @param {string} trackId - The trackId of the audio track to seek.
   * @param {number} seek - The time in seconds to seek to.
   */
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

  /**
   * It unsubscribes from the stateEnabledSubscription and stateMutedSubscription.
   */
  public destroy() {
    this.unsubscribe()
    this.stateEnabledSubscription()
    this.stateMutedSubscription()
  }
}
