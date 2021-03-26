import { IEventEmitter } from '../../../services/common'
import {
  DATA_EVENTS,
  IDataMutator,
  IDataProvider,
} from '../../../services/data/interfaces'

export class StorageService implements IDataProvider, IDataMutator {
  private readonly localStorage!: Storage
  constructor(
    win: Window,
    private eventBus: IEventEmitter,
    private name: string,
    private prefix: string = '',
  ) {
    this.localStorage = win.localStorage
    window?.addEventListener(
      'storage',
      () => {
        this.eventBus.emit(DATA_EVENTS.DataChanged, {
          provider: this.name,
        })
      },
      { passive: true },
    )
  }

  async get(key: string): Promise<string | null> {
    return this.localStorage?.getItem(this.prefix + key) || null
  }

  async set(key: string, value: string) {
    const existing = await this.get(key)
    if (existing == value) return
    this.localStorage?.setItem(this.prefix + key, value)
    this.eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: this.name,
    })
  }
}
