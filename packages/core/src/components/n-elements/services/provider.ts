import { debounce } from '../../../services/common'
import { EventEmitter } from '../../../services/common/emitter'
import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { ElementsActionListener } from './actions'

/* It listens to changes in the DOM and emits a `changed` event when it detects a change */
export class ElementsDataProvider implements IDataProvider {
  changed: EventEmitter
  listenerSubscription!: () => void
  /**
   * A constructor function that takes in two parameters, a document and an elementListener. It then
   * creates a new EventEmitter and assigns it to the changed property. It then creates a new variable
   * called change and assigns it to a debounce function. The debounce function takes in three
   * parameters, a number, a function, and a boolean. The function that is passed in as a parameter
   * emits a DataChanged event. The listenerSubscription property is assigned to the
   * elementListener.changed property and is passed in a function that calls the change function.
   * @param {Document} doc - Document - this is the document object that is used to create the
   * elements.
   * @param {ElementsActionListener} elementListener - ElementsActionListener - this is the service
   * that listens to the changes in the elements.
   */
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

  /**
   * The function unsubscribes from the listenerSubscription, which is a subscription to the listener
   * function
   */
   public destroy() {
    this.listenerSubscription()
  }
}
