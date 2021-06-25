import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import {
  addDataProvider,
  removeDataProvider,
} from '../../services/data/factory'
import { AudioActionListener } from './services/actions'
import { AudioDataProvider } from './services/provider'
import { audioState } from './services/state'

/**
 * Use this element only once per page to enable audio features.
 * It will add a CDN reference to Howler.js:
 * <https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js>
 *
 * @system audio
 * @extension actions
 * @extension provider
 *
 */
@Component({
  tag: 'n-audio',
  styleUrl: 'audio.css',
  shadow: true,
})
export class Audio {
  private actionSubscription!: () => void
  private stateSubscription!: () => void
  @Element() el!: HTMLNAudioElement
  private provider?: AudioDataProvider

  @State() error: string | null = null
  @State() stats = {
    m: 0,
    ml: 0,
    mq: 0,
    s: 0,
    sl: 0,
  }

  /**
   * A reference to the action listener for testing.
   */
  @Prop({ mutable: true }) public actions?: AudioActionListener

  /**
   * The Howler.js Script Reference
   */
  @Prop() howlerVersion: string = '2.2.1'

  /**
   * The display mode enabled shows player state and stats.
   * No track information or duration is be displayed.
   */
  @Prop() display: boolean = false

  /**
   * Use debug for verbose logging. Useful for figuring
   * thing out.
   */
  @Prop() debug: boolean = false

  /**
   * Experimental support for providing audio-data in the
   * data-provider system.
   */
  @Prop() dataProvider: boolean = false

  private enableAudio() {
    commonState.audioEnabled = true
  }

  componentWillLoad() {
    debugIf(this.debug, 'n-audio: loading')
    audioState.debug = this.debug

    if (audioState.hasAudioComponent) {
      this.error = `Duplicate Audio Player`
      return
    }
  }

  private registerServices() {
    debugIf(this.debug, `n-audio: loading listener`)
    this.actions = new AudioActionListener(
      window,
      eventBus,
      actionBus,
      this.debug,
    )

    this.actionSubscription = this.actions.changed.on(
      'changed',
      () => {
        this.updateState()
      },
    )

    audioState.hasAudioComponent = true

    if (commonState.dataEnabled && this.dataProvider) {
      debugIf(this.debug, `n-audio: loading provider`)
      this.provider = new AudioDataProvider(this.actions)
      addDataProvider('audio', this.provider)
    }
  }

  private updateState() {
    this.stats = {
      m: this.actions?.music.active ? 1 : 0,
      ml: this.actions?.music.loader.items.length || 0,
      mq: this.actions?.music.queue.items.length || 0,
      s: this.actions?.sound.active ? 1 : 0,
      sl: this.actions?.sound.loader.items.length || 0,
    }
  }

  private Error() {
    return (
      <Host hidden={!this.display}>
        <div>
          <p class="error">{this.error}</p>
        </div>
      </Host>
    )
  }

  private Disabled() {
    return (
      <Host hidden={!this.display}>
        <div>
          <p>Audio Disabled</p>
          <button
            onClick={() => {
              this.enableAudio()
            }}
          >
            Enable
          </button>
        </div>
      </Host>
    )
  }

  private Audio() {
    if (!this.display) return null
    return (
      <div>
        <p>Audio {this.actions!.isPlaying() ? 'Playing' : 'Ready'}</p>
        <span title="m=music s=sound l=loaded q=queued">
          M:{this.stats.m}&nbsp;MQ:{this.stats.mq}&nbsp;ML:
          {this.stats.ml}&nbsp;S:{this.stats.s}&nbsp;SL:
          {this.stats.sl}
        </span>
      </div>
    )
  }

  private NoAudio() {
    if (!this.display) return null
    return (
      <div>
        <p>No Audio</p>
      </div>
    )
  }

  render() {
    if (this.error) return this.Error()

    if (!commonState.audioEnabled) return this.Disabled()

    return (
      <Host hidden={!this.display}>
        <n-content-reference
          inline={true}
          onReferenced={() => {
            this.registerServices()
          }}
          script-src={`https://cdn.jsdelivr.net/npm/howler@${this.howlerVersion}/dist/howler.core.min.js`}
        ></n-content-reference>
        {this.actions?.hasAudio() ? this.Audio() : this.NoAudio()}
      </Host>
    )
  }

  disconnectedCallback() {
    audioState.hasAudioComponent = false
    this.stateSubscription?.call(this)
    this.actionSubscription?.call(this)
    if (this.provider) {
      removeDataProvider('audio')
      this.provider.destroy()
    }
    this.actions?.destroy()
  }
}
