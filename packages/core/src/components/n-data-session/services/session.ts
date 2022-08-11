import { IEventEmitter } from '../../../services/common'
import {
  DATA_EVENTS,
  IDataMutator,
  IDataProvider,
} from '../../../services/data/interfaces'

/* It's a data provider that uses the sessionStorage API to store data */
export class SessionService implements IDataProvider, IDataMutator {
  private readonly sessionStorage!: Storage
  /**
   * A constructor function that takes in a window object, an eventBus object, a name string, and a
   * prefix string. The prefix string is set to an empty string by default. The constructor function
   * then sets the sessionStorage property to the window's sessionStorage.
   * @param {Window} win - Window - the window object
   * @param {IEventEmitter} eventBus - IEventEmitter - This is the event bus that the class will use to
   * emit events.
   * @param {string} name - The name of the session storage key.
   * @param {string} [prefix] - This is the prefix that will be used for all the keys in the session
   * storage.
   */
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
