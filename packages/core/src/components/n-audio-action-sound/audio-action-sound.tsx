import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
} from '@stencil/core'
import {
  actionBus,
  EventAction,
  IActionElement,
} from '../../services/actions'
import { debugIf } from '../../services/common/logging'
import {
  AudioType,
  AUDIO_TOPIC,
} from '../n-audio/services/interfaces'
import {
  audioState,
  onAudioStateChange,
} from '../n-audio/services/state'

/**
 * This element represents an action to be fired. This
 * specialized action encapsulates required parameters
 * needed for audio-based actions, for sound.
 *
 * @system audio
 * @system actions
 */
@Component({
  tag: 'n-audio-action-sound',
  shadow: true,
})
export class AudioSoundAction implements IActionElement {
  @Element() el!: HTMLNAudioActionSoundElement

  /**
   * Readonly topic
   *
   */
  @Prop() readonly topic = 'audio'

  /**
   * The command to execute.
   */
  @Prop() command!:
    | 'start'
    | 'pause'
    | 'resume'
    | 'mute'
    | 'volume'
    | 'seek'

  /**
   * The track to target.
   */
  @Prop() trackId?: string

  /**
   * The value payload for the command.
   */
  @Prop() value?: string | boolean | number

  /**
   * Get the underlying actionEvent instance. Used by the n-action-activator element.
   */
  @Method()
  async getAction(): Promise<EventAction<any>> {
    return {
      topic: AUDIO_TOPIC,
      command: this.command,
      data: {
        type: AudioType.sound,
        trackId: this.trackId,
        value: this.value,
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
              `n-audio-action-sound: load-action sent for ${this.trackId}`,
            )
          }
        },
      )
    }
  }

  render() {
    return <Host></Host>
  }
}
