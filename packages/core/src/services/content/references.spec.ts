jest.mock('../common/logging')

import {
  clearReferences,
  hasReference,
  markReference,
} from './references'

describe('references:', () => {
  it('all methods ', async () => {
    const url = 'https://some-url.com'
    markReference(url)

    expect(hasReference(url)).toBe(true)

    clearReferences()
  })
})
