/* istanbul ignore file */

import { EventEmitter } from '../../common/emitter'
import { DATA_EVENTS, IDataProvider } from '../interfaces'

export class InMemoryProvider implements IDataProvider {
  data: { [index: string]: any } = {}
  constructor() {
    this.changed = new EventEmitter()
  }

  public async get(key: string): Promise<string | null> {
    return this.data[key] || null
  }

  public async set(key: string, value: string): Promise<void> {
    this.data[key] = value
    this.changed.emit(DATA_EVENTS.DataChanged)
  }

  public changed: EventEmitter

  public destroy() {
    this.changed.removeAllListeners()
  }
}
