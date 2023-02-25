import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import { EventAction, IActionElement } from '../../services/actions'
import { ActionService } from '../../services/actions/service'
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
 * needed for audio-based actions, for music.
 *
 * @system audio
 * @system actions
 */
@Component({
  tag: 'n-audio-action-music',
  shadow: true,
})
export class AudioMusicAction implements IActionElement {
  @Element() el!: HTMLNAudioActionMusicElement
  @State() valid: boolean = true
  private actionService!: ActionService
  private dispose?: () => void

  constructor() {
    this.actionService = new ActionService(
      this,
      'n-audio-action-music',
    )
  }

  get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  get childInputs() {
    return this.el.querySelectorAll('input,select,textarea')
  }

  /**
   * Readonly topic
   *
   */
  @Prop() readonly topic = AUDIO_TOPIC

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
   * A predicate to evaluate prior to sending the action.
   */
  @Prop() when?: string

  private getData() {
    return {
      type: AudioType.music,
      trackId: this.trackId,
      value: this.value,
    }
  }

  /**
   * Get the underlying actionEvent instance. Used by the n-action-activator element.
   */
  @Method()
  async getAction(): Promise<EventAction<any> | null> {
    const action = await this.actionService.getAction()
    if (action == null) return null
    Object.assign(action.data, this.getData())
    return action
  }
  /**
   * Send this action to the the action messaging system.
   */
  @Method()
  async sendAction(data?: Record<string, any>) {
    if (audioState.hasAudioComponent) {
      Object.assign(data || {}, this.getData())
      this.actionService.sendAction(data)
    } else {
      this.dispose = onAudioStateChange(
        'hasAudioComponent',
        async loaded => {
          if (loaded) {
            this.actionService.sendAction(data)
            debugIf(
              audioState.debug,
              `n-audio-action-music: load-action sent for ${this.trackId}`,
            )
          }
          this.dispose?.call(this)
        },
      )
    }
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    this.dispose?.call(this)
  }
}
