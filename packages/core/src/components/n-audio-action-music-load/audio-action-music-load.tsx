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
import { debugIf } from '../../services/common'
import {
  AudioInfo,
  AudioRequest,
  AudioType,
  AUDIO_TOPIC,
} from '../n-audio/services/interfaces'
import {
  audioState,
  onAudioStateChange,
} from '../n-audio/services/state'

/**
 * This component declares audio used within this \<n-view-prompt\> route.
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
  tag: 'n-audio-action-music-load',
  shadow: true,
})
export class AudioMusicLoad {
  @Element() el!: HTMLNAudioActionMusicLoadElement
  @State() sent: boolean = false

  /**
   * The path to the audio-file.
   * @required
   */
  @Prop() src!: string

  /**
   * The identifier for this music track
   */
  @Prop() trackId!: string

  /**
   * This is loading strategy that determines
   * what is should do after the file is retrieved.
   */
  @Prop() mode: 'queue' | 'play' | 'load' = 'queue'

  /**
   * The discard strategy the player should use for this file.
   */
  @Prop() discard: 'route' | 'next' | 'none' = 'route'

  /**
   * Set this to true to have the audio file loop.
   */
  @Prop() loop = false

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
      command: this.mode,
      data: {
        trackId: this.trackId || this.src,
        src: this.src,
        discard: this.discard,
        loop: this.loop,
        type: AudioType.music,
        mode: this.mode,
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
      actionBus.emit(action.topic, action)
    } else {
      const dispose = onAudioStateChange(
        'hasAudioComponent',
        async loaded => {
          if (loaded) {
            dispose()
            actionBus.emit(action.topic, action)
            debugIf(
              audioState.debug,
              `n-audio-action-music-load: load-action sent for ${this.trackId}`,
            )
            this.sent = true
          }
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
}
