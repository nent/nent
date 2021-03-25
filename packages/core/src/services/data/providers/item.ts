/* istanbul ignore file */
import { EventEmitter } from '../../common/emitter'
import { DATA_EVENTS, IDataProvider } from '../interfaces'

export class DataItemProvider implements IDataProvider {
  constructor(
    private data: any,
    private readonly setter?: (
      key: string,
      value: any,
    ) => Promise<void>,
  ) {
    this.changed = new EventEmitter()
  }

  async get(key: string): Promise<string> {
    if (key === 'item') {
      return this.data
    }

    return this.data[key]
  }

  async set(key: string, value: string): Promise<void> {
    if (this.setter) {
      await this.setter(key, value)
    } else {
      this.data[key] = value
    }

    this.changed.emit(DATA_EVENTS.DataChanged)
  }

  changed: EventEmitter
}
