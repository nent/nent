import { debounce } from '../../../services/common'
import { EventEmitter } from '../../../services/common/emitter'
import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { ElementsActionListener } from './actions'

export class ElementsDataProvider implements IDataProvider {
  changed: EventEmitter
  listenerSubscription!: () => void
  constructor(
    private doc: Document,
    private elementListener: ElementsActionListener,
  ) {
    this.changed = new EventEmitter()
    const change = debounce(
      1000,
      () => {
        this.changed.emit(DATA_EVENTS.DataChanged, {
          provider: 'element',
        })
      },
      true,
    )
    this.listenerSubscription = this.elementListener.changed.on(
      'changed',
      () => {
        change()
      },
    )
  }

  async get(key: string): Promise<string | null> {
    const element = this.doc.querySelector('#' + key) as any
    return element?.value || element.innerText || null
  }

  destroy() {
    this.listenerSubscription()
  }
}
