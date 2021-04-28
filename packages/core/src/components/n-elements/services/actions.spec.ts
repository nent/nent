jest.mock('../../../services/common/logging')

import { MockWindow } from '@stencil/core/mock-doc'
import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter, sleep } from '../../../services/common'
import { ElementsActionListener } from './actions'
import { ELEMENTS_COMMANDS, ELEMENTS_TOPIC } from './interfaces'

describe('elements-actions:', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter

  beforeAll(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  afterAll(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('elementToggleClass ', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
      autoApplyChanges: true,
    })
    const subject = new ElementsActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.toggleClass,
      data: {
        selector: 'div',
        className: 'test',
      },
    })

    let element = page.body.querySelector('div')
    let hasClass = element?.classList.contains('test')
    expect(hasClass).toBe(true)

    subject.destroy()
  })

  it('addClasses, removeClasses', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new ElementsActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.addClasses,
      data: {
        selector: 'div',
        classes: 'test',
      },
    })

    await page.waitForChanges()

    let element = page.body.querySelector('div')

    let hasClass = element?.classList.contains('test')

    expect(hasClass).toBe(true)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.removeClasses,
      data: {
        selector: 'div',
        classes: 'test',
      },
    })

    element = page.body.querySelector('div')
    hasClass = element?.classList.contains('test')

    expect(hasClass).toBe(false)
    subject.destroy()
  })

  it('setAttribute, removeAttribute', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    const subject = new ElementsActionListener()
    subject.initialize(page.win, actionBus, eventBus)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.setAttribute,
      data: {
        selector: 'div',
        attribute: 'test',
      },
    })

    await page.waitForChanges()

    let element = page.body.querySelector('div')

    let hasAttribute = element?.hasAttribute('test')

    expect(hasAttribute).toBe(true)

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.removeAttribute,
      data: {
        selector: 'div',
        attribute: 'test',
      },
    })

    element = page.body.querySelector('div')
    hasAttribute = element?.hasAttribute('test')

    expect(hasAttribute).toBe(false)
    subject.destroy()
  })

  it('interface listener: AddClasses / RemoveClasses', async () => {
    const fakeWindow = new MockWindow(
      '<html><body><h1>Hello</h1></body></html>',
    )

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(
      fakeWindow.window,
      actionBus,
      eventBus,
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.addClasses,
      data: {
        selector: 'h1',
        classes: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe(
      '<h1 class="test">Hello</h1>',
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.removeClasses,
      data: {
        selector: 'h1',
        classes: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1>Hello</h1>')
  })

  it('interface listener: elementToggleClass', async () => {
    const fakeWindow = new MockWindow(
      '<html><body><h1>Hello</h1></body></html>',
    )

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(
      fakeWindow.window,
      actionBus,
      eventBus,
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.toggleClass,
      data: {
        selector: 'h1',
        className: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe(
      '<h1 class="test">Hello</h1>',
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.toggleClass,
      data: {
        selector: 'h1',
        className: 'test',
      },
    })

    await sleep(300)

    expect(fakeWindow.document.body.innerHTML).toBe('<h1>Hello</h1>')
  })

  it('interface listener: SetAttribute / RemoveAttribute', async () => {
    const fakeWindow = new MockWindow(
      '<html><body><h1>Hello</h1></body></html>',
    )

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(
      fakeWindow.window,
      actionBus,
      eventBus,
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.setAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
      },
    })

    expect(fakeWindow.document.body.innerHTML).toBe(
      '<h1 hidden="">Hello</h1>',
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.setAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
        value: 'true',
      },
    })

    expect(fakeWindow.document.body.innerHTML).toBe(
      '<h1 hidden="true">Hello</h1>',
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.removeAttribute,
      data: {
        selector: 'h1',
        attribute: 'hidden',
      },
    })

    expect(fakeWindow.document.body.innerHTML).toBe('<h1>Hello</h1>')
  })

  it('interface listener: CallElementFun', async () => {
    const fakeWindow = new MockWindow(
      `<html>
      <body>
      <h1>Hello</h1>
      <button />
      </body>
      </html>`,
    )

    const interfaceListener = new ElementsActionListener()
    interfaceListener.initialize(
      fakeWindow.window,
      actionBus,
      eventBus,
    )

    actionBus.emit(ELEMENTS_TOPIC, {
      topic: ELEMENTS_TOPIC,
      command: ELEMENTS_COMMANDS.callMethod,
      data: {
        selector: 'button',
        method: 'click',
        data: null,
      },
    })
  })
})
