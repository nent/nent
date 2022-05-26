jest.mock('../../../../services/data/evaluate.worker')
jest.mock('../../../../services/common/logging', () => {
  return {
    dir: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    table: jest.fn(),
    debugIf: jest.fn<boolean, any[]>(),
  }
})

import { newSpecPage } from '@stencil/core/testing'
import { appState, APP_COMMANDS, APP_TOPIC } from '..'
import { actionBus, eventBus } from '../../../../services/actions'
import { table } from '../../../../services/common/logging'
import { App } from '../../app'
import { DefaultAppProvider } from './default'

describe('default-provider', () => {
  let custom: DefaultAppProvider

  beforeEach(() => {
    custom = new DefaultAppProvider(window, eventBus)
  })

  afterEach(() => {
    custom.destroy()
    eventBus.removeAllListeners()
  })

  it('getDarkMode: true', async () => {
    const page = await newSpecPage({
      components: [App],
    })
    page.win.localStorage.setItem('darkMode', 'true')
    await page.setContent(`<n-app></n-app>`)
    await page.waitForChanges()

    expect(appState.darkMode).toBeTruthy()
  })

  it('setDarkMode: true', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app></n-app>`,
    })

    await page.waitForChanges()

    appState.darkMode = true

    const result = window.localStorage.getItem('darkMode')
    expect(result).toBe('true')
  })

  it('setDarkMode: false', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app></n-app>`,
    })

    await page.waitForChanges()

    appState.darkMode = false

    const result = window.localStorage.getItem('darkMode')
    expect(result).toBe('false')
  })

  it('log: table', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app></n-app>`,
    })

    await page.waitForChanges()

    actionBus.emit(APP_TOPIC, {
      command: APP_COMMANDS.Log,
      data: {
        test: 'test',
      },
    })

    expect(table).toBeCalled()
  })
})
