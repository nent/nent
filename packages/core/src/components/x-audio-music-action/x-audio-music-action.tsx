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
import { AudioType, AUDIO_TOPIC } from '../x-audio/audio/interfaces'
import {
  audioState,
  onAudioStateChange,
} from '../x-audio/audio/state'

/**
 * This element represents an action to be fired. This
 * specialized action encapsulates required parameters
 * needed for audio-based actions, for music.
 *
 * @system audio
 */
@Component({
  tag: 'x-audio-music-action',
  shadow: true,
})
export class XAudioMusicAction implements IActionElement {
  @Element() el!: HTMLXAudioMusicActionElement

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
   * Get the underlying actionEvent instance. Used by the x-action-activator element.
   */
  @Method()
  async getAction(): Promise<EventAction<any>> {
    return {
      topic: AUDIO_TOPIC,
      command: this.command,
      data: {
        type: AudioType.music,
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
              `x-audio-music-action: load-action sent for ${this.trackId}`,
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
