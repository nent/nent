jest.mock('../common/logging')
jest.mock('../data/evaluate.worker')

import { actionBus, eventBus } from '../actions'
import { addDataProvider } from '../data/factory'
import { InMemoryProvider } from '../data/providers/memory'
import { dataState } from '../data/state'
import { IViewDo, VisitStrategy } from './interfaces'
import { resolveNext } from './next'
import { clearVisits, markVisit } from './visits'

describe('next-resolver: find next', () => {
  let toDos: IViewDo[]
  let session: InMemoryProvider

  beforeEach(async () => {
    dataState.enabled = true
    session = new InMemoryProvider()
    addDataProvider('session', session)
    toDos = []
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    await clearVisits()
  })

  const setupBasicPath = () => {
    toDos = [
      {
        when: '!{{session:name}}',
        url: '/name',
      },
      {
        when: '!{{session:email}}',
        url: '/email',
      },
      {
        when: '!{{session:color}}',
        url: '/color',
      },
      {
        visit: VisitStrategy.once,
        url: '/once',
      },
      {
        visit: VisitStrategy.once,
        url: '/terms',
      },
      {
        visit: VisitStrategy.optional,
        url: '/optional',
      },
      {
        visit: VisitStrategy.always,
        url: '/always',
      },
    ]
  }

  it('when resolves to true', async () => {
    setupBasicPath()
    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/name')
  })

  it('when resolves to true, visited', async () => {
    setupBasicPath()
    toDos[0].visited = true

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/name')
  })

  it('multiple when resolution, find first', async () => {
    setupBasicPath()
    await session.set('name', 'biden')

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/email')
  })

  it('multiple when resolution, find first visited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    toDos[1].visited = true

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/email')
  })

  it('multiple when resolution, find first of three', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/color')
  })

  it('multiple when resolution, find first unvisited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/once')
  })

  it('multiple when resolution, find first once visited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    await markVisit('/once')

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/terms')
  })

  it('multiple when resolution, find first once all visited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    await markVisit('/once')
    await markVisit('/terms')

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/always')
  })

  it('multiple when resolution, find first unmet condition once all visited', async () => {
    setupBasicPath()
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    await markVisit('/name')
    await markVisit('/once')
    await markVisit('/terms')

    const result = await resolveNext(toDos)
    expect(result?.url).toBe('/name')
  })
})
