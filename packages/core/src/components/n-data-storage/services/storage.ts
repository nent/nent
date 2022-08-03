import { IEventEmitter } from '../../../services/common'
import {
  DATA_EVENTS,
  IDataMutator,
  IDataProvider,
} from '../../../services/data/interfaces'

/* It's a wrapper around the localStorage API that emits an event when the data changes */
export class StorageService implements IDataProvider, IDataMutator {
  private readonly localStorage!: Storage
  /**
   * `constructor` is a function that is called when a new instance of the class is created
   * @param {Window} win - Window - the window object
   * @param {IEventEmitter} eventBus - This is the event bus that we created in the previous step.
   * @param {string} name - The name of the provider. This is used to identify the provider when
   * emitting events.
   * @param {string} [prefix] - This is the prefix that will be used for all keys in the local storage.
   */
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
