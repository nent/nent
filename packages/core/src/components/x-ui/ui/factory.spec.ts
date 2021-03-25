jest.mock('../../../services/common/logging')

import { getUIProvider, setUIProvider } from './factory'
import { DefaultUIProvider } from './providers/default'

describe('provider-factory', () => {
  let custom: DefaultUIProvider

  beforeEach(() => {
    custom = new DefaultUIProvider()
  })

  afterEach(() => {
    custom.destroy()
  })

  it('getProvider: should return default', async () => {
    const provider = getUIProvider()
    expect(provider).not.toBeNull()
  })

  it('getProvider: returns custom provider', async () => {
    setUIProvider('custom', custom)
    const provider = getUIProvider()
    expect(provider).toBe(custom)
  })
})
