import { IEventEmitter } from '../../../services/common/interfaces'
import {
  DATA_EVENTS,
  IDataMutator,
  IDataProvider,
} from '../../../services/data/interfaces'
import { getCookie, setCookie } from './utils'

export class CookieService implements IDataProvider, IDataMutator {
  constructor(
    private document: Document,
    private eventBus: IEventEmitter,
    private name: string,
  ) {}

  async get(key: string): Promise<string | null> {
    return getCookie(this.document, key) || null
  }

  async set(key: string, value: any) {
    const existing = await this.get(key)
    if (existing == value) return
    setCookie(this.document, key, value, { sameSite: 'strict' })
    this.eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: this.name,
    })
  }
}
