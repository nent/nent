jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import { getAppProvider, setAppProvider } from './factory'
import { DefaultAppProvider } from './providers/default'

describe('provider-factory', () => {
  let custom: DefaultAppProvider

  beforeEach(() => {
    custom = new DefaultAppProvider()
  })

  afterEach(() => {
    custom.destroy()
  })

  it('getProvider: should return default', async () => {
    const provider = getAppProvider()
    expect(provider).not.toBeNull()
  })

  it('getProvider: returns custom provider', async () => {
    setAppProvider('custom', custom)
    const provider = getAppProvider()
    expect(provider).toBe(custom)
  })
})
