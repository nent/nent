jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import { actionBus, eventBus } from '../../../services/actions'
import { addDataProvider } from '../../../services/data/factory'
import { InMemoryProvider } from '../../../services/data/providers/memory'
import { dataState } from '../../../services/data/state'
import { IViewPrompt, VisitStrategy } from './interfaces'
import { resolveNext } from './next'
import { clearVisits, markVisit } from './visits'

describe('next-resolver: find next', () => {
  let toDos: IViewPrompt[]
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
        path: '/name',
      },
      {
        when: '!{{session:email}}',
        path: '/email',
      },
      {
        when: '!{{session:color}}',
        path: '/color',
      },
      {
        visit: VisitStrategy.once,
        path: '/once',
      },
      {
        visit: VisitStrategy.once,
        path: '/terms',
      },
      {
        visit: VisitStrategy.optional,
        path: '/optional',
      },
      {
        visit: VisitStrategy.always,
        path: '/always',
      },
    ]
  }

  it('when resolves to true', async () => {
    setupBasicPath()
    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/name')
  })

  it('when resolves to true, visited', async () => {
    setupBasicPath()
    toDos[0].visited = true

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/name')
  })

  it('multiple when resolution, find first', async () => {
    setupBasicPath()
    await session.set('name', 'biden')

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/email')
  })

  it('multiple when resolution, find first visited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    toDos[1].visited = true

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/email')
  })

  it('multiple when resolution, find first of three', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/color')
  })

  it('multiple when resolution, find first unvisited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/once')
  })

  it('multiple when resolution, find first once visited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    await markVisit('/once')

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/terms')
  })

  it('multiple when resolution, find first once all visited', async () => {
    setupBasicPath()
    await session.set('name', 'biden')
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    await markVisit('/once')
    await markVisit('/terms')

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/always')
  })

  it('multiple when resolution, find first unmet condition once all visited', async () => {
    setupBasicPath()
    await session.set('email', 'j@biden.com')
    await session.set('color', 'red')

    await markVisit('/name')
    await markVisit('/once')
    await markVisit('/terms')

    const result = await resolveNext(toDos)
    expect(result?.path).toBe('/name')
  })
})
