import { IEventEmitter } from '../../../services/common'
import {
  DATA_EVENTS,
  IDataMutator,
  IDataProvider,
} from '../../../services/data/interfaces'

export class SessionService implements IDataProvider, IDataMutator {
  private readonly sessionStorage!: Storage
  constructor(
    win: Window,
    private eventBus: IEventEmitter,
    private name: string,
    private prefix: string = '',
  ) {
    this.sessionStorage = win.sessionStorage
  }

  async get(key: string): Promise<string | null> {
    return this.sessionStorage?.getItem(this.prefix + key)
  }

  async set(key: string, value: any): Promise<void> {
    const existing = await this.get(key)
    if (existing == value) return
    this.sessionStorage?.setItem(this.prefix + key, value)
    this.eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: this.name,
    })
  }
}
