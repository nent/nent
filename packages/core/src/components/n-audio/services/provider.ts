import { debounce } from '../../../services/common'
import { EventEmitter } from '../../../services/common/emitter'
import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { AudioActionListener } from './actions'

export class AudioDataProvider implements IDataProvider {
  changed: EventEmitter
  listenerSubscription!: () => void
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

  destroy() {
    this.listenerSubscription()
  }
}
