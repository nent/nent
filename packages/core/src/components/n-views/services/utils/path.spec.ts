import { ensureBasename, getPossiblePaths, hasBasename } from './path'

describe('match-path:', () => {
  it('renders', async () => {})
})

describe('path-utils', () => {
  it('router: ensureBasename', async () => {
    expect(ensureBasename('/home', '/root')).toBe('/root/home')

    expect(ensureBasename('/home', '')).toBe('/home')

    expect(ensureBasename('/home', '/')).toBe('/home')

    expect(ensureBasename('/home', '')).toBe('/home')

    expect(ensureBasename('/home', '/@root')).toBe('/@root/home')

    expect(ensureBasename('/about', '/examples/simple.html#/')).toBe(
      '/examples/simple.html#/about',
    )
  })

  it('router: hasBaseName', async () => {
    expect(hasBasename('/root/home', '/root')).toBe(true)

    expect(hasBasename('/home', '')).toBe(true)

    expect(hasBasename('/home', '/')).toBe(true)

    expect(hasBasename('#/home', '#/')).toBe(true)

    expect(
      hasBasename('/examples/simple.html#/', '/examples/simple.html'),
    ).toBe(true)

    expect(hasBasename('/@root/home', '/@root')).toBe(true)

    expect(
      hasBasename(
        '/examples/simple.html#/about',
        '/examples/simple.html#/',
      ),
    ).toBe(true)
  })

  it('routes: get related (parents x 1)', () => {
    const routes = ['/']

    const path = '/'

    const parents = getPossiblePaths(path)
    expect(parents.length).toBe(routes.length)
    expect(parents[0]).toBe(routes[0])
  })

  it('routes: get related (parents x 2)', () => {
    const routes = ['/', '/routing']

    const path = '/routing'

    const parents = getPossiblePaths(path)
    expect(parents.length).toBe(routes.length)
    expect(parents[0]).toBe(routes[0])
  })

  it('routes: get related (parents x 3)', () => {
    const routes = ['/', '/routing', '/routing/navigation']

    const path = '/routing/navigation'

    const parents = getPossiblePaths(path)

    expect(parents.length).toBe(routes.length)
    expect(parents[0]).toBe(routes[0])
    expect(parents[1]).toBe(routes[1])
  })

  it('routes: get related (parents x 4)', () => {
    const routes = [
      '/',
      '/routing',
      '/routing/navigation',
      '/routing/navigation/guided',
    ]

    const path = '/routing/navigation/guided'

    const parents = getPossiblePaths(path)

    expect(parents.length).toBe(routes.length)
    expect(parents[0]).toBe(routes[0])
    expect(parents[1]).toBe(routes[1])
    expect(parents[2]).toBe(routes[2])
  })

  it('routes: get related (parents x 5)', () => {
    const routes = [
      '/',
      '/routing',
      '/routing/navigation',
      '/routing/navigation/guided',
      '/routing/navigation/guided/tutorial',
    ]

    const path = '/routing/navigation/guided/tutorial'

    const parents = getPossiblePaths(path)

    expect(parents.length).toBe(routes.length)
    expect(parents[0]).toBe(routes[0])
    expect(parents[1]).toBe(routes[1])
    expect(parents[2]).toBe(routes[2])
    expect(parents[3]).toBe(routes[3])
  })

  it('routes: get related (parents x 6)', () => {
    const routes = [
      '/',
      '/routing',
      '/routing/navigation',
      '/routing/navigation/guided',
      '/routing/navigation/guided/tutorial',
    ]

    const path = '/routing/navigation/guided/tutorial'

    const parents = getPossiblePaths(path)

    expect(parents.length).toBe(routes.length)
    expect(parents[0]).toBe(routes[0])
    expect(parents[1]).toBe(routes[1])
    expect(parents[2]).toBe(routes[2])
    expect(parents[3]).toBe(routes[3])
  })
})
