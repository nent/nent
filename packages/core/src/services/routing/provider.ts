import { EventEmitter } from '../common/emitter'
import { IDataProvider } from '../data/interfaces'

export class RoutingDataProvider implements IDataProvider {
  changed: EventEmitter
  constructor(private readonly accessor: (key: string) => any) {
    this.changed = new EventEmitter()
  }

  async get(key: string): Promise<string> {
    return this.accessor(key)
  }

  async set(_key: string, _value: string): Promise<void> {
    // Do nothing
  }
}
