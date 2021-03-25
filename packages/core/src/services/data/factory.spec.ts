jest.mock('../common/logging')
jest.mock('../data/evaluate.worker')

import { actionBus, eventBus } from '../actions'
import {
  addDataProvider,
  clearDataProviders,
  getDataProvider,
  removeDataProvider,
} from './factory'
import { InMemoryProvider } from './providers/memory'
import { dataStateDispose } from './state'

describe('provider-factory', () => {
  let custom: InMemoryProvider

  beforeEach(() => {
    custom = new InMemoryProvider()
    addDataProvider('custom', custom)
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  afterEach(() => {
    dataStateDispose()
  })

  it('getProvider: incorrect name should return null', async () => {
    const provider = await getDataProvider('bad')
    expect(provider).toBe(null)
  })

  it('getProvider: returns custom provider', async () => {
    const provider = await getDataProvider('custom')
    expect(provider).toBe(custom)
  })

  it('removeProvider: removes correctly', async () => {
    removeDataProvider('custom')
    const provider = await getDataProvider('custom')
    expect(provider).toBe(null)
  })

  it('clearDataProviders: removes correctly', async () => {
    clearDataProviders()
    const provider = await getDataProvider('custom')
    expect(provider).toBe(null)
  })
})
