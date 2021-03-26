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
import { ReferenceCompleteResults } from '../../services/content/interfaces'
import { addDataProvider } from '../../services/data/factory'
import { AudioActionListener } from './services/actions'
import { AudioDataProvider } from './services/provider'
import { audioState, onAudioStateChange } from './services/state'

/**
 * Use this element only once per page to enable audio features.
 * It will add a CDN reference to Howler.js:
 * <https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js>
 *
 * @system audio
 * @actions true
 * @provider true
 *
 */
@Component({
  tag: 'n-audio',
  styleUrl: 'audio.css',
  shadow: true,
})
export class Audio {
  private listenerSubscription!: () => void
  private stateListener!: () => void
  @Element() el!: HTMLNAudioElement
  // private volumeInput!: HTMLInputElement
  private data?: AudioDataProvider

  @State() muted: boolean = false
  @State() volume: number = 0
  @State() enabled: boolean = false
  @State() hasAudio: boolean = false
  @State() isPlaying: boolean = false
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
    audioState.enabled = true
  }

  componentWillLoad() {
    debugIf(this.debug, 'n-audio: loading')

    if (audioState.hasAudioComponent) {
      this.error = `Duplicate Audio Player`
      return
    }

    this.stateListener = onAudioStateChange('enabled', enabled => {
      this.enabled = enabled
    })

    commonState.audioEnabled = true
    this.enabled = audioState.enabled

    audioState.debug = this.debug
  }

  private referenceComplete(
    results: CustomEvent<ReferenceCompleteResults>,
  ) {
    if (results.detail.loaded) {
      this.registerServices()
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

    this.listenerSubscription = this.actions.changed.on(
      'changed',
      () => {
        this.updateState()
      },
    )

    audioState.hasAudioComponent = true

    if (this.dataProvider) {
      debugIf(this.debug, `n-audio: loading provider`)
      this.data = new AudioDataProvider(this.actions)
      addDataProvider('audio', this.data)
    }
    this.updateState()
  }

  componentWillRender() {
    this.updateState()
  }

  private updateState() {
    this.hasAudio = this.actions?.hasAudio || false
    this.isPlaying = this.actions?.isPlaying || false
    this.muted = this.actions?.muted || false
    this.volume = this.actions?.volume || 1
    this.enabled = this.actions?.enabled || audioState.enabled
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
        <p>Audio {this.isPlaying ? 'Playing' : 'Ready'}</p>
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

    if (!this.enabled) return this.Disabled()

    return (
      <Host hidden={!this.display}>
        <n-content-reference
          inline={true}
          onReferenced={(
            ev: CustomEvent<ReferenceCompleteResults>,
          ) => {
            this.referenceComplete(ev)
          }}
          script-src={`https://cdn.jsdelivr.net/npm/howler@${this.howlerVersion}/dist/howler.core.min.js`}
        ></n-content-reference>
        {this.hasAudio ? this.Audio() : this.NoAudio()}
      </Host>
    )
  }

  disconnectedCallback() {
    audioState.hasAudioComponent = false
    this.stateListener()
    this.listenerSubscription?.call(this)
    this.data?.destroy()
    this.actions?.destroy()
  }
}
