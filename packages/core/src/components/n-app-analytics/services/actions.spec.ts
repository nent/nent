jest.mock('../../../services/data/evaluate.worker')
jest.mock('../../../services/common/logging')

import { EventEmitter } from '../../../services/common'
import { ROUTE_EVENTS } from '../../n-views/services/interfaces'
import { AnalyticsActionListener } from './actions'
import {
  ANALYTICS_COMMANDS,
  ANALYTICS_EVENTS,
  ANALYTICS_TOPIC,
} from './interfaces'

describe('analytics-listener', () => {
  let subject: AnalyticsActionListener | null = null
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  beforeEach(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  it('listener registered', async () => {
    let result: any = null
    eventBus.on(ANALYTICS_EVENTS.ListenerRegistered, listener => {
      result = listener
    })

    subject = new AnalyticsActionListener(actionBus, eventBus)

    expect(result).not.toBeUndefined()
    expect(result).toBe(subject)
  })

  it('empty handlers', async () => {
    subject = new AnalyticsActionListener(actionBus, eventBus)

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendViewTime,
      data: {},
    })

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendPageView,
      data: {},
    })

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendEvent,
      data: {},
    })

    subject.destroy()
  })

  it('handleViewTime: registers listeners event: view-time', async () => {
    subject = new AnalyticsActionListener(actionBus, eventBus)

    let result: any = null
    subject.handleViewTime = e => {
      result = e
    }

    const data = {
      percent: '10',
    }

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendViewTime,
      data,
    })

    expect(result).toBe(data)
    subject.destroy()
  })

  it('handlePageView: registers listeners event: page-view', async () => {
    subject = new AnalyticsActionListener(actionBus, eventBus)

    let result: any = null
    subject.handlePageView = e => {
      result = e
    }

    const data = {}

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendPageView,
      data,
    })

    expect(result).toBe(data)

    subject.destroy()
  })

  it('handlePageView: route-changed', async () => {
    subject = new AnalyticsActionListener(actionBus, eventBus)

    let result: any = null
    subject.handlePageView = e => {
      result = e
    }

    const data = {
      pathname: '/fake',
    }

    eventBus.emit(ROUTE_EVENTS.RouteChanged, data)

    expect(result).toBe(data)

    subject.destroy()
  })

  it('handleEvent: registers listeners event: custom event', async () => {
    subject = new AnalyticsActionListener(actionBus, eventBus)

    let result: any = null
    subject.handleEvent = e => {
      result = e
    }

    const data = {}

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendEvent,
      data,
    })

    expect(result).toBe(data)

    subject.destroy()
  })
})
