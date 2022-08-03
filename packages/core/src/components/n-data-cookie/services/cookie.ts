import { IEventEmitter } from '../../../services/common/interfaces'
import {
  DATA_EVENTS,
  IDataMutator,
  IDataProvider,
} from '../../../services/data/interfaces'
import { getCookie, setCookie } from './utils'

/* It's a data provider that uses cookies to store data */
export class CookieService implements IDataProvider, IDataMutator {
  /**
   * A constructor function.
   * @param {Document} document - The document object.
   * @param {IEventEmitter} eventBus - IEventEmitter - This is the event bus that the component will
   * use to communicate with other components.
   * @param {string} name - The name of the component.
   */
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
