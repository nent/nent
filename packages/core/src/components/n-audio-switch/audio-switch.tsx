import { Component, h, Host, Prop } from '@stencil/core'
import { eventBus } from '../../services/actions'
import {
  commonState,
  onCommonStateChange,
} from '../../services/common'
import { getDataProvider } from '../../services/data/factory'
import { IServiceProvider } from '../../services/data/interfaces'
import {
  AUDIO_EVENTS,
  AUDIO_TOPIC,
} from '../n-audio/services/interfaces'
import {
  audioState,
  onAudioStateChange,
} from '../n-audio/services/state'

/**
 * This element exposes a checkbox to enable or disable global audio for background sounds and video.
 *
 * @system audio
 */
@Component({
  tag: 'n-audio-switch',
  shadow: false,
})
export class AudioSwitch {
  private checkbox?: HTMLInputElement
  private subscription!: () => void
  private storage: IServiceProvider | null = null

  private get stateKey() {
    return `audio-${this.setting}`
  }

  private set value(value: boolean) {
    switch (this.setting) {
      case 'enabled': {
        commonState.audioEnabled = value
        break
      }
      case 'muted': {
        audioState.muted = value
        break
      }
    }
  }

  private get value(): boolean {
    switch (this.setting) {
      case 'enabled': {
        return commonState.audioEnabled
      }
      case 'muted': {
        return audioState.muted
      }
    }
  }

  /**
   * Which state property this switch controls.
   */
  @Prop() setting: 'muted' | 'enabled' = 'enabled'

  /**
   * Any classes to add to the input-element directly.
   */
  @Prop() inputClass?: string

  /**
   * The id field to add to the input-element directly.
   */
  @Prop() inputId?: string

  /**
   * The data provider to store the audio state in.
   */
  @Prop() dataProvider: string = 'storage'

  async componentWillLoad() {
    this.storage = (await getDataProvider(
      this.dataProvider,
    )) as IServiceProvider

    if (this.storage) {
      const value = await this.storage?.get(this.stateKey)
      if (value != null) {
        this.value = value == 'true'
      }
    }

    this.subscription =
      this.setting == 'muted'
        ? onAudioStateChange(this.setting, async m => {
            this.value = m
            await this.storage?.set(this.stateKey, m.toString())
            eventBus.emit(AUDIO_TOPIC, AUDIO_EVENTS.SoundChanged, m)
          })
        : onCommonStateChange('audioEnabled', async m => {
            this.value = m
            await this.storage?.set(this.stateKey, m.toString())
            eventBus.emit(AUDIO_TOPIC, AUDIO_EVENTS.SoundChanged, m)
          })
  }

  private toggle() {
    this.value = this.checkbox?.checked || false
  }

  disconnectedCallback() {
    this.subscription?.call(this)
  }

  render() {
    return (
      <Host>
        <input
          type="checkbox"
          class={this.inputClass}
          id={this.inputId}
          ref={e => {
            this.checkbox = e
          }}
          onChange={() => this.toggle()}
          checked={this.value}
        ></input>
      </Host>
    )
  }
}
