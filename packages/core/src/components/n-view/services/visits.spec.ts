jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import { commonStateDispose } from '../../../services/common/state'
import {
  dataState,
  dataStateDispose,
} from '../../../services/data/state'
import { VisitStrategy } from './interfaces'
import { navigationStateDispose } from './state'
import {
  clearVisits,
  getSessionVisits,
  getStoredVisits,
  hasVisited,
  markVisit,
  recordVisit,
  storeVisit,
} from './visits'

describe('visits', () => {
  beforeAll(() => {
    dataState.providerTimeout = 0
  })

  afterEach(() => {
    commonStateDispose()
    navigationStateDispose()
  })

  afterAll(() => {
    dataStateDispose()
  })

  it('markVisit', async () => {
    await markVisit('/fake-url')

    expect(await hasVisited('/fake-url')).toBe(true)
    await clearVisits()
  })

  it('storeVisit', async () => {
    await storeVisit('/fake-url')

    expect(await hasVisited('/fake-url')).toBe(true)
    await clearVisits()
  })

  it('recordVisit: always', async () => {
    await recordVisit(VisitStrategy.always, '/fake-url')

    expect(await hasVisited('/fake-url')).toBe(true)

    let visits = await getStoredVisits()
    expect(visits).not.toContain('/fake-url')
    visits = await getSessionVisits()

    expect(visits).toContain('/fake-url')

    await clearVisits()
  })

  it('recordVisit: once', async () => {
    await recordVisit(VisitStrategy.once, '/fake-url')

    expect(await hasVisited('/fake-url')).toBe(true)

    let visits = await getStoredVisits()
    expect(visits).toContain('/fake-url')
    visits = await getSessionVisits()

    expect(visits).not.toContain('/fake-url')

    await clearVisits()
  })
})
