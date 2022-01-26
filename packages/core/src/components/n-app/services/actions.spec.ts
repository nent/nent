jest.mock('../../../services/common/logging', () => {
  return {
    dir: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    table: jest.fn(),
    debugIf: jest.fn<boolean, any[]>(),
  }
})
jest.mock('../../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../../../services/common/emitter'
import {
  dir,
  log,
  table,
  warn,
} from '../../../services/common/logging'
import { AppActionListener } from './actions'
import { clearAppProvider, getAppProvider } from './factory'
import { APP_COMMANDS, APP_TOPIC } from './interfaces'

let called = false
class MockProvider {
  doTheThing(..._args: any[]) {
    called = true
  }
}

describe('interface-actions:', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter

  beforeAll(() => {
    jest.restoreAllMocks()
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  test('register-provider', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new AppActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    const provider = new MockProvider()

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: APP_COMMANDS.RegisterProvider,
      data: {
        name: 'special',
        provider,
      },
    })

    let result = getAppProvider()
    expect(result).toBe(provider)

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: 'do-the-thing',
      data: {
        name: 'special',
      },
    })

    await page.waitForChanges()

    expect(called).toBe(true)

    clearAppProvider()

    result = getAppProvider()

    expect(result).toBeNull()

    subject.destroy()
  })

  it('set-theme: init', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new AppActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    subject.defaultProvider.setDarkMode({ value: 'true' })

    expect(page.win.localStorage.getItem('darkMode')).toBe('true')

    subject.destroy()
  })

  test('set-theme: action', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new AppActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: APP_COMMANDS.SetDarkMode,
      data: {
        value: 'true',
      },
    })

    expect(page.win.localStorage.getItem('darkMode')).toBe('true')

    subject.destroy()
  })

  test('log, warn and dir', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new AppActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: APP_COMMANDS.Log,
      data: {
        message: 'do not log in tests!',
      },
    })

    expect(log).toBeCalled()

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: APP_COMMANDS.Warn,
      data: {
        message: 'do not log in tests!',
      },
    })

    expect(warn).toBeCalled()

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: APP_COMMANDS.Dir,
      data: {
        message: 'do not log in tests!',
      },
    })

    expect(dir).toBeCalled()

    page.root?.remove()
  })
})
