jest.mock('../../../services/common/logging')

import { EventEmitter } from '../../../services/common'
import {
  clearDataProviders,
  getDataProvider,
  getDataProviders,
} from '../../../services/data/factory'
import {
  DATA_EVENTS,
  DATA_TOPIC,
  IDataProvider,
} from '../../../services/data/interfaces'
import { InMemoryProvider } from '../../../services/data/providers/memory'
import { DataListener } from './actions'
import { DATA_COMMANDS } from './interfaces'

class MockDataProvider extends InMemoryProvider {
  changed = new EventEmitter()
  setItem(x: string, y: string) {
    this.set(x, y)
  }

  removeItem(_x: string | number) {
    delete this.data[_x]
  }
}

describe('data-provider-listener', () => {
  let subject: DataListener | null = null
  let mockWindow: any
  let mockDataProvider: IDataProvider
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  beforeEach(() => {
    mockDataProvider = new MockDataProvider()
    clearDataProviders()
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
    mockWindow = {
      sessionStorage: mockDataProvider,
      localStorage: mockDataProvider,
    }
  })

  it('detects session', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const session = getDataProvider('session')
    expect(session).toBeDefined()
  })

  it('detects session failed', async () => {
    delete mockWindow.sessionStorage
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const session = await getDataProvider('session')
    expect(session).toBeNull()
  })

  it('detects storage', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const storage = await getDataProvider('storage')
    expect(storage).toBeDefined()
  })

  it('detects storage failed', async () => {
    delete mockWindow.localStorage
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const storage = await getDataProvider('storage')
    expect(storage).toBeNull()
  })

  it('eventListener: handles listeners events', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)
    const listeners = getDataProviders()
    expect(Object.keys(listeners).length).toBe(0)

    const event = {
      command: DATA_COMMANDS.RegisterDataProvider,
      data: {
        name: 'mock',
        provider: mockDataProvider,
      },
    }

    actionBus.emit(DATA_TOPIC, event)

    const mock = await getDataProvider('mock')
    expect(mock).toBeDefined()
    expect(mock).toBe(mockDataProvider)

    subject.destroy()
  })

  it('eventListener: handles provider events', async () => {
    subject = new DataListener()
    subject.initialize(mockWindow, actionBus, eventBus)

    let result: any
    eventBus.on(DATA_EVENTS.DataChanged, e => {
      result = e
    })

    const event = {
      command: DATA_COMMANDS.RegisterDataProvider,
      data: {
        name: 'mock',
        provider: mockDataProvider,
      },
    }

    actionBus.emit(DATA_TOPIC, event)

    const mock = await getDataProvider('mock')
    expect(mock).toBeDefined()
    expect(mock).toBe(mockDataProvider)

    mockDataProvider.changed?.emit('something happened!')

    expect(result).toBeDefined()
    expect(result.provider).toBe('mock')
  })
})
