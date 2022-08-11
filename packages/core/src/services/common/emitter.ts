/* istanbul ignore file */

import { IEventEmitter, IEvents, Listener } from './interfaces'

export class EventEmitter implements IEventEmitter {
  readonly events: IEvents = {}
  private wildcardEvents: string[] = []

  private recalcWildcardEvents() {
    const newWildCardEvents = []
    for (const i in this.events) {
      if (
        i.endsWith('*') &&
        this.events[i] &&
        this.events[i].length > 0
      ) {
        newWildCardEvents.push(i)
      }
    }

    this.wildcardEvents = newWildCardEvents
  }

  public on(event: string, listener: Listener): () => void {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = []
    }

    this.events[event].push(listener)
    this.recalcWildcardEvents()
    return () => {
      this.removeListener(event, listener)
    }
  }

  public removeListener(event: string, listener: Listener): void {
    if (typeof this.events[event] !== 'object') {
      return
    }

    const idx: number = this.events[event].indexOf(listener)
    if (idx > -1) {
      this.events[event].splice(idx, 1)
    }

    this.recalcWildcardEvents()
  }

  public removeAllListeners(): void {
    Object.keys(this.events).forEach((event: string) =>
      this.events[event].splice(0, this.events[event].length),
    )
    this.recalcWildcardEvents()
  }

  public emit(event: string, ...args: any[]): void {
    if (typeof this.events[event] === 'object') {
      ;[...this.events[event]].forEach(listener => {
        listener.apply(this, args)
      })
    }

    if (event !== '*') {
      this.emit('*', event, ...args)
      return
    }

    for (const rawWcEvent of this.wildcardEvents) {
      const wcEvent = rawWcEvent.slice(
        0,
        rawWcEvent.endsWith('.*') ? -2 : -1,
      )
      if (
        !event.endsWith('*') &&
        event !== wcEvent &&
        event.startsWith(wcEvent)
      ) {
        this.emit(rawWcEvent, event, ...args)
      }
    }
  }

  public once(event: string, listener: Listener): () => void {
    const remove: () => void = this.on(event, (...args: any[]) => {
      remove()
      listener.apply(this, args)
      this.recalcWildcardEvents()
    })

    return remove
  }

  destroy(): void {
    this.removeAllListeners()
  }
}
