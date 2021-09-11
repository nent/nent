import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import { actionBus, EventAction } from '../../services/actions'
import { debugIf } from '../../services/common/logging'
import {
  AudioInfo,
  AudioRequest,
  AudioType,
  AUDIO_TOPIC,
  DiscardStrategy,
  LoadStrategy,
} from '../n-audio/services/interfaces'
import {
  audioState,
  onAudioStateChange,
} from '../n-audio/services/state'
import { playedTrack } from '../n-audio/services/tracks'

/**
 * This element declares audio used within this \<n-view-prompt\> route.
 * The \<n-audio-action-sound-load\> instructs the player to load audio files
 * while defining play behaviors.
 *
 * The audio player will pre-load or play when the route is active.
 * The player manages them according to their settings.
 *
 * @system audio
 * @system actions
 */
@Component({
  tag: 'n-audio-action-sound-load',
  shadow: true,
})
export class AudioSoundLoad {
  @Element() el!: HTMLNAudioActionSoundLoadElement
  @State() sent: boolean = false
  private dispose?: () => void

  /**
   * The path to the audio-file.
   */
  @Prop() src!: string

  /**
   * The identifier for this music track
   */
  @Prop() trackId!: string

  /**
   * This is the loading strategy that determines
   * what it should do after the file is retrieved.
   */
  @Prop() mode: 'queue' | 'play' | 'load' = 'load'

  /**
   * The discard strategy the player should use for this file.
   */
  @Prop() discard: 'route' | 'next' | 'none' = 'route'

  /**
   * If set, disables auto-rendering of this instance.
   * To fetch the contents change to false or remove
   * attribute.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * Get the underlying actionEvent instance.
   */
  @Method()
  public async getAction(): Promise<
    EventAction<AudioInfo | AudioRequest | any>
  > {
    return {
      topic: AUDIO_TOPIC,
      command: this.mode || LoadStrategy.load,
      data: {
        trackId: this.trackId || this.src,
        src: this.src,
        discard: this.discard || DiscardStrategy.route,
        loop: false,
        type: AudioType.sound,
        mode: this.mode || LoadStrategy.load,
      },
    }
  }

  /**
   * Send this action to the the action messaging system.
   */
  @Method()
  async sendAction(data?: Record<string, any>) {
    const action = await this.getAction()
    if (data) Object.assign(action.data, data)
    if (audioState.hasAudioComponent) {
      const trackPlayed = await playedTrack(this.trackId)
      if (this.mode == 'play' && trackPlayed) return
      actionBus.emit(action.topic, action)
    } else {
      this.dispose = onAudioStateChange(
        'hasAudioComponent',
        async loaded => {
          if (loaded) {
            actionBus.emit(action.topic, action)
            debugIf(
              audioState.debug,
              `n-audio-action-sound-load: load-action sent for ${this.trackId}`,
            )
            this.sent = true
          }
          this.dispose?.call(this)
        },
      )
    }
  }

  async componentWillRender() {
    if (this.deferLoad || this.sent) return
    await this.sendAction()
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    this.dispose?.call(this)
  }
}
