jest.mock('../common/logging')

import {
  clearReferences,
  hasReference,
  markReference,
} from './references'

describe('references:', () => {
  it('all methods ', async () => {
    const url = 'https://some-url.com'
    await markReference(url)

    expect(await hasReference(url)).toBe(true)

    await clearReferences()
  })
})
