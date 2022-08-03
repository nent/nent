import {
  EventEmitter,
  IEventEmitter,
  Listener,
  warnIf,
} from '../../../services/common'
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

/* It's a wrapper around the browser's history API that emits events when the location changes */
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

    this.win.addEventListener('popstate', e => {
      this.handlePop(this.getDOMLocation(e.state))
    })
  }

  private getHistoryState() {
    return this.win.history.state || {}
  }

  /**
   * It returns a location object with the pathname, state, and key properties
   * @param {any} historyState - any
   * @returns A location object
   */
  public getDOMLocation(historyState: any) {
    const { key, state = {} } = historyState || {}
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

  private handlePop(location: LocationSegments) {
    if (locationsAreEqual(this.location, location)) {
      return // A hashchange doesn't always == location change.
    }
    this.setState('POP', location)
  }

  /**
   * It pushes a new location to the history stack, and updates the state of the history object
   * @param {string} path - string
   * @param {any} state - any = {}
   * @returns the location object.
   */
  public push(path: string, state: any = {}) {
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

  /**
   * It replaces the current history entry with a new one
   * @param {string} path - The path of the URL.
   * @param {any} state - any = {}
   */
  public replace(path: string, state: any = {}) {
    const action = 'REPLACE'

    const location = createLocation(
      path,
      state,
      createKey(KeyLength),
      this.location,
    )
    location.search = this.location.search

    const href = this.createHref(location)
    const { key } = location

    this.win.history.replaceState({ key, state }, '', href)
    const previousIndex = this.allKeys.indexOf(this.location.key)

    if (previousIndex !== -1) {
      this.allKeys[previousIndex] = location.key
    }

    this.setState(action, location)
  }

  /**
   * It takes a location object and returns a path string
   * @param {LocationSegments} location - LocationSegments
   * @returns A string that is the pathname of the location object.
   */
  public createHref(location: LocationSegments) {
    return ensureBasename(createPath(location), this.basename)
  }

  /**
   * It captures the scroll position of the current view, then updates the location and scroll position
   * of the new view
   * @param {string} action - string
   * @param {LocationSegments} location - LocationSegments
   */
  public setState(action: string, location: LocationSegments) {
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

  /**
   * It goes to a specific page in the history
   * @param {number} n - number - The number of steps to go back or forward in the history.
   */
  public go(n: number) {
    this.win.history.go(n)
    this.events.emit('GO', this.location)
  }

  /**
   * It goes back one page in the browser's history, and then emits an event called BACK
   */
  public goBack() {
    this.win.history.back()
    this.events.emit('BACK', this.location)
  }

  /**
   * It goes forward in the browser history
   */
  public goForward() {
    this.win.history.forward()
    this.events.emit('FORWARD', this.location)
  }

  /**
   * It takes a listener function as an argument, calls that function with the current location, and
   * then returns a function that will remove the listener from the event emitter
   * @param {Listener} listener - Listener
   * @returns A function that removes the listener from the events object.
   */
  public listen(listener: Listener) {
    listener(this.location)
    return this.events.on('*', (_a, location) => {
      listener(location)
    })
  }

  /**
   * Destroys history service
   */
  public destroy() {
    this.events.removeAllListeners()
  }
}
