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
import {
  commonState,
  onCommonStateChange,
} from '../../services/common/state'
import { getDataProvider } from '../../services/data/factory'
import { IServiceProvider } from '../../services/data/interfaces'
import { AudioActionListener } from './services/actions'
import { audioState, onAudioStateChange } from './services/state'

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
  private audioStateSubscription?: () => void
  private commonStateSubscription?: () => void

  @Element() el!: HTMLNAudioElement
  @State() loaded: boolean = false
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
   * No track information or duration is to be displayed.
   */
  @Prop() display: boolean = false

  /**
   * Use debug for verbose logging. Useful for figuring
   * things out.
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

  async componentWillLoad() {
    debugIf(this.debug, 'n-audio: loading')

    audioState.debug = this.debug

    if (audioState.hasAudioComponent) {
      this.error = `Duplicate Audio Player`
      return
    }

    if (commonState.dataEnabled) {
      const storage = (await getDataProvider(
        'storage',
      )) as IServiceProvider

      const storedValue = await storage?.get('audio-enabled')
      if (storedValue) {
        commonState.audioEnabled = storedValue != 'false'
      }

      audioState.muted = (await storage?.get('audio-muted')) == 'true'

      this.audioStateSubscription = onAudioStateChange(
        'muted',
        async m => {
          await storage?.set('audio-muted', m.toString())
        },
      )

      this.commonStateSubscription = onCommonStateChange(
        'audioEnabled',
        async m => {
          await storage?.set('audio-enabled', m.toString())
        },
      )
    }
  }

  private registerServices() {
    if (this.loaded) return

    debugIf(this.debug, `n-audio: loading listener`)

    this.actions = new AudioActionListener(
      window,
      eventBus,
      actionBus,
      this.dataProvider,
      this.debug,
    )

    this.actionSubscription = this.actions.changed.on(
      'changed',
      () => {
        this.updateState()
      },
    )

    audioState.hasAudioComponent = true

    this.loaded = true
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
    this.audioStateSubscription?.call(this)
    this.commonStateSubscription?.call(this)
    this.actions?.destroy()
  }
}
