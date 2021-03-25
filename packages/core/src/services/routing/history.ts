import {
  EventEmitter,
  IEventEmitter,
  Listener,
  warnIf,
} from '../common'
import { LocationSegments } from './interfaces'
import { ScrollHistory } from './scroll'
import {
  createKey,
  createLocation,
  locationsAreEqual,
} from './utils/location'
import {
  createPath,
  ensureBasename,
  hasBasename,
  stripBasename,
} from './utils/path'

const KeyLength = 6

export class HistoryService {
  events: IEventEmitter
  location: LocationSegments
  allKeys: string[] = []
  scrollHistory: ScrollHistory
  previousLocation!: LocationSegments

  constructor(public win: Window, private basename: string) {
    this.events = new EventEmitter()
    this.location = this.getDOMLocation(this.getHistoryState())
    this.previousLocation = this.location
    this.allKeys.push(this.location.key)
    this.scrollHistory = new ScrollHistory(win)

    this.push(this.location.pathname)

    this.win.addEventListener('popstate', e => {
      this.handlePop(this.getDOMLocation(e.state))
    })
  }

  private getHistoryState() {
    return this.win.history.state || {}
  }

  public getDOMLocation(historyState: any) {
    const { key, state } = historyState || {}
    const { pathname, search, hash } = this.win.location

    let path = pathname + search + hash

    warnIf(
      !hasBasename(path, this.basename),
      `You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "${path}" to begin with "${this.basename}".`,
    )

    if (this.basename) {
      path = stripBasename(path, this.basename)
    }

    return createLocation(path, state, key || createKey(6))
  }

  handlePop(location: LocationSegments) {
    if (locationsAreEqual(this.location, location)) {
      return // A hashchange doesn't always == location change.
    }
    this.setState('POP', location)
  }

  push(path: string, state: any = {}) {
    const action = 'PUSH'
    const location = createLocation(
      path,
      state,
      createKey(KeyLength),
      this.location,
    )

    const href = this.createHref(location)
    const { key } = location

    if (locationsAreEqual(this.location, location)) return

    this.win.history.pushState({ key, state }, '', href)

    const previousIndex = this.allKeys.indexOf(this.location.key)
    const nextKeys = this.allKeys.slice(
      0,
      previousIndex === -1 ? 0 : previousIndex + 1,
    )

    nextKeys.push(location.key)
    this.allKeys = nextKeys

    this.setState(action, location)
  }

  replace(path: string, state: any = {}) {
    const action = 'REPLACE'
    const location = createLocation(
      path,
      state,
      createKey(KeyLength),
      this.location,
    )

    const href = this.createHref(location)
    const { key } = location

    this.win.history.replaceState({ key, state }, '', href)
    const previousIndex = this.allKeys.indexOf(this.location.key)

    if (previousIndex !== -1) {
      this.allKeys[previousIndex] = location.key
    }

    this.setState(action, location)
  }

  createHref(location: LocationSegments) {
    return ensureBasename(createPath(location), this.basename)
  }

  setState(action: string, location: LocationSegments) {
    // Capture location for the view before changing history.
    this.scrollHistory.capture(this.location.key)

    this.previousLocation = this.location
    this.location = location

    // Set scroll position based on its previous storage value
    this.location.scrollPosition = this.scrollHistory.get(
      this.location.key,
    )

    this.events.emit(action, this.location)
  }

  go(n: number) {
    this.win.history.go(n)
  }

  goBack() {
    this.win.history.back()
  }

  goForward() {
    this.win.history.forward()
  }

  public listen(listener: Listener) {
    listener(this.location)
    return this.events.on('*', (_a, location) => {
      listener(location)
    })
  }

  destroy() {
    this.events.removeAllListeners()
  }
}
