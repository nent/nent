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

  it('no reference ', async () => {
    const url = 'https://some-url.com'
    await markReference(url)

    expect(await hasReference('https://some-other.com')).toBe(false)

    await clearReferences()
  })
})
