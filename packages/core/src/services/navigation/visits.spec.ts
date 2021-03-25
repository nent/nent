jest.mock('../common/logging')
jest.mock('../data/evaluate.worker')

import { dataState } from '../data/state'
import { VisitStrategy } from './interfaces'
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
  dataState.providerTimeout = 0

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
