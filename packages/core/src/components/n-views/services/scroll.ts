import { getDataProvider } from '../../../services/data/factory'
import { IServiceProvider } from '../../../services/data/interfaces'

const RouterScrollKey = 'scrollPositions'

/* It's a class that stores scroll positions in a map and saves them to the session storage */
export class ScrollHistory {
  scrollPositions: Map<string, [number, number]>
  provider?: IServiceProvider | null
  /**
   * We're getting the scroll position from the session storage and setting it to the scrollPositions
   * variable
   * @param {Window} win - Window - This is the window object.
   */
  constructor(private win: Window) {
    this.scrollPositions = new Map<string, [number, number]>()

    getDataProvider('session').then(provider => {
      this.provider = provider as IServiceProvider
      return provider?.get(RouterScrollKey).then(scrollData => {
        if (scrollData)
          this.scrollPositions = new Map(JSON.parse(scrollData))
      })
    })

    if (win && 'scrollRestoration' in win.history) {
      win.history.scrollRestoration = 'manual'
    }
  }

  set(key: string, value: [number, number]) {
    this.scrollPositions.set(key, value)
    if (this.provider) {
      const arrayData: Array<[string, [number, number]]> = []

      this.scrollPositions.forEach((v, k) => {
        arrayData.push([k, v])
      })
      this.provider
        .set(RouterScrollKey, JSON.stringify(arrayData))
        .then(() => {})
    }
  }

  get(key: string) {
    return this.scrollPositions.get(key)
  }

  has(key: string) {
    return this.scrollPositions.has(key)
  }

  capture(key: string) {
    this.set(key, [this.win.scrollX, this.win.scrollY])
  }
}
