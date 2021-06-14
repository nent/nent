jest.mock('../../../services/common/logging')
global.console.log = jest.fn()
global.console.dir = jest.fn()
global.console.table = jest.fn()

import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../../../services/common/emitter'
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
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  it('register-provider', async () => {
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

  it('set-theme: action', async () => {
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

  it('log, warn and dir', async () => {
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

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: 'warn',
      data: {
        message: 'do not log in tests!',
      },
    })

    actionBus.emit(APP_TOPIC, {
      topic: APP_TOPIC,
      command: 'dir',
      data: {
        message: 'do not log in tests!',
      },
    })

    subject.destroy()
  })
})
