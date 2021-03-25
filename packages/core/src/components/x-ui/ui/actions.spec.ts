jest.mock('../../../services/common/logging')
global.console.log = jest.fn()
global.console.dir = jest.fn()
global.console.table = jest.fn()

import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../../../services/common/emitter'
import { UIActionListener } from './actions'
import { clearUIProvider, getUIProvider } from './factory'
import { UI_COMMANDS, UI_TOPIC } from './interfaces'

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
    const subject = new UIActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    const provider = new MockProvider()

    actionBus.emit(UI_TOPIC, {
      topic: UI_TOPIC,
      command: UI_COMMANDS.RegisterProvider,
      data: {
        name: 'special',
        provider,
      },
    })

    let result = getUIProvider()
    expect(result).toBe(provider)

    actionBus.emit(UI_TOPIC, {
      topic: UI_TOPIC,
      command: 'do-the-thing',
      data: {
        name: 'special',
      },
    })

    await page.waitForChanges()

    expect(called).toBe(true)

    clearUIProvider()

    result = getUIProvider()

    expect(result).toBeNull()

    subject.destroy()
  })

  it('set-theme: init', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new UIActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    subject.defaultProvider.setTheme('dark')

    expect(page.win.localStorage.getItem('theme')).toBe('dark')

    subject.destroy()
  })

  it('set-theme: action', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new UIActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(UI_TOPIC, {
      topic: UI_TOPIC,
      command: UI_COMMANDS.SetTheme,
      data: 'dark',
    })

    expect(page.win.localStorage.getItem('theme')).toBe('dark')

    subject.destroy()
  })

  it('log, warn and dir', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new UIActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(UI_TOPIC, {
      topic: UI_TOPIC,
      command: UI_COMMANDS.Log,
      data: {
        message: 'do not log in tests!',
      },
    })

    actionBus.emit(UI_TOPIC, {
      topic: UI_TOPIC,
      command: 'warn',
      data: {
        message: 'do not log in tests!',
      },
    })

    actionBus.emit(UI_TOPIC, {
      topic: UI_TOPIC,
      command: 'dir',
      data: {
        message: 'do not log in tests!',
      },
    })

    subject.destroy()
  })
})
