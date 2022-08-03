import { debounce } from '../../../services/common'
import { EventEmitter } from '../../../services/common/emitter'
import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { AudioActionListener } from './actions'

/* It listens to the audio listener and emits a `changed` event when the audio listener changes */
export class AudioDataProvider implements IDataProvider {
  changed: EventEmitter
  listenerSubscription!: () => void
  /**
   * A constructor function that takes in an audioListener as a parameter. It then creates a new
   * EventEmitter and assigns it to the changed property. It then creates a change function that is
   * debounced and emits a changed event. It then subscribes to the audioListener's changed event and
   * calls the change function.
   * @param {AudioActionListener} audioListener - AudioActionListener - this is the service that
   * listens for changes to the audio data.
   */
  constructor(private audioListener: AudioActionListener) {
    this.changed = new EventEmitter()
    const change = debounce(
      1000,
      () => {
        this.changed.emit(DATA_EVENTS.DataChanged, {
          provider: 'audio',
        })
      },
      true,
    )
    this.listenerSubscription = this.audioListener.changed.on(
      'changed',
      () => {
        change()
      },
    )
  }

  async get(key: string): Promise<string | null> {
    switch (key) {
      // Global
      case 'hasAudio':
        return this.audioListener.hasAudio().toString()
      case 'isPlaying':
        return this.audioListener.isPlaying().toString()

      // Music files
      case 'loadedMusic':
        return this.audioListener.music
          ? JSON.stringify(this.audioListener.music.loader.items)
          : null
      case 'queuedMusic':
        return this.audioListener.music
          ? JSON.stringify(this.audioListener.music.queue.items)
          : null
      case 'currentMusic':
        return this.audioListener.music.active
          ? JSON.stringify(this.audioListener.music.active)
          : null

      // Sound files
      case 'loadedSounds':
        return this.audioListener.sound.loader.items
          ? JSON.stringify(this.audioListener.sound.loader.items)
          : null
      case 'currentSound':
        return this.audioListener.sound.active
          ? JSON.stringify(this.audioListener.sound.active)
          : null

      default:
        return null
    }
  }

  async set(_key: string, _value: any): Promise<void> {
    // do nothing
  }

  /**
   * It destroys the listener subscription.
   */
  public destroy() {
    this.listenerSubscription()
  }
}
