jest.mock('../../../services/data/evaluate.worker')
import { newSpecPage, SpecPage } from '@stencil/core/testing'
import {
  commonState,
  commonStateDispose,
} from '../../../services/common/state'
import { addDataProvider } from '../../../services/data/factory'
import { InMemoryProvider } from '../../../services/data/providers/memory'
import { dataStateDispose } from '../../../services/data/state'
import { ScrollHistory } from './scroll'

describe('scroll', () => {
  let page: SpecPage
  let win: Window
  let session: InMemoryProvider
  beforeEach(async () => {
    commonState.dataEnabled = true
    session = new InMemoryProvider()
    addDataProvider('session', session)
    page = await newSpecPage({
      components: [],
    })
    win = page.win
  })

  afterEach(() => {
    dataStateDispose()
    commonStateDispose()
    session.changed?.removeAllListeners()
  })
  it('set, has & get', async () => {
    // Arguments
    const key = '1'
    const value: [number, number] = [1, 10]

    // Method call
    const scrollHistory = new ScrollHistory(win)

    await page.waitForChanges()

    scrollHistory.set(key, value)

    expect(scrollHistory.has(key)).toBeTruthy()

    expect(scrollHistory.get(key)).toBe(value)
  })

  it('capture & get', () => {
    // Arguments
    const key = '2'

    // Method call
    const scrollHistory = new ScrollHistory(win)

    // @ts-ignore
    win.scrollX = 0
    // @ts-ignore
    win.scrollY = 10
    scrollHistory.capture(key)

    const [x, y] = scrollHistory.get(key) || [0, 0]

    expect(x).toBe(0)
    expect(y).toBe(10)
  })

  it('init from provider', async () => {
    session.set('scrollPositions', `[["zz30",[0,20]]]`)
    // Arguments
    const key = 'zz30'

    // Method call
    const scrollHistory = new ScrollHistory(win)

    await page.waitForChanges()

    const [x, y] = scrollHistory.get(key) || [0, 0]
    expect(x).toBe(0)
    expect(y).toBe(20)
  })
})
