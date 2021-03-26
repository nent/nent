jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/actions'
import { Action } from '../n-action/action'
import { ActionActivator } from './action-activator'

describe('n-action-activator', () => {
  beforeAll(() => {})

  afterAll(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('no-actions', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator>
              <div></div>
             </n-action-activator>`,
    })
    expect(page.root).toEqualHtml(
      `<n-action-activator>
      <div></div>
      </n-action-activator>`,
    )
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator>
              <n-action topic="fake" command="noop"></n-action>
             </n-action-activator>`,
    })
    expect(page.root).toEqualHtml(
      `<n-action-activator>
      <n-action topic="fake" command="noop"></n-action>
      </n-action-activator>`,
    )
  })

  it('captures child actions', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator activate="on-enter">
               <n-action topic="test" command="pass"></n-action
             </n-action-activator>`,
    })

    const activator = page.body.querySelector('n-action-activator')
    expect(activator).toBeDefined()

    let command = null
    actionBus.on('test', e => {
      command = e.command
    })

    await activator?.activateActions()

    expect(command).toBe('pass')
  })

  it('captures child actions, only fires once', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator activate="on-enter" once>
               <n-action topic="test" command="pass"></n-action
             </n-action-activator>`,
    })

    const activator = page.body.querySelector('n-action-activator')
    expect(activator).toBeDefined()

    let command = null
    actionBus.on('test', e => {
      command = e.command
    })

    await activator!.activateActions()

    expect(command).toBe('pass')

    command = null
    await activator!.activateActions()

    expect(command).toBeNull()
  })

  it('captures child element event', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator activate="on-element-event" target-element="button" target-event="click" >
               <button type="button">Click Me</button>
               <n-action topic="test" command="pass"></n-action>
             </n-action-activator>`,
    })

    await page.waitForChanges()

    const activator = page.body.querySelector('n-action-activator')
    expect(activator).toBeDefined()

    const button = page.body.querySelector('button')

    let command = null
    actionBus.on('test', e => {
      command = e.command
    })

    button?.click()

    await page.waitForChanges()

    expect(command).toBe('pass')

    button?.click()

    activator?.remove()
  })

  it('captures child input values', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator activate="on-element-event" target-element="button" >
               <n-action topic="test" command="pass"></n-action>
               <input type="text" name="text" value="Tom" />
               <input type="hidden" name="hidden" value="fed-ex" />
               <input type="checkbox" name="agree" checked/>
               <input type="text" value="index" />
               <button type="button">Click Me</button>
             </n-action-activator>`,
    })

    await page.waitForChanges()

    const activator = page.body.querySelector('n-action-activator')
    expect(activator).toBeDefined()

    const button = page.body.querySelector('button')

    let eventAction: EventAction<any> | null = null
    actionBus.on('test', e => {
      eventAction = e
    })

    button?.click()

    await page.waitForChanges()

    expect(eventAction!.command).toBe('pass')
    expect(eventAction!.data).not.toBeNull()
    expect(eventAction!.data.text).toBe('Tom')
    expect(eventAction!.data.hidden).toBe('fed-ex')
    expect(eventAction!.data.agree).toBe(true)
    expect(eventAction!.data[3]).toBe('index')
  })

  it('captures child element event no selector', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator activate="on-element-event" >
               <input type="button">Click Me </input>
               <n-action topic="test" command="pass"></n-action>
             </n-action-activator>`,
    })

    await page.waitForChanges()

    const activator = page.body.querySelector('n-action-activator')
    expect(activator).toBeDefined()

    const link = page.body.querySelector('input')

    let command = null
    actionBus.on('test', e => {
      command = e.command
    })

    link?.click()

    await page.waitForChanges()

    expect(command).toBe('pass')

    activator?.remove()
  })

  it('does not capture if no element exists', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator>
               <n-action topic="test" command="pass"></n-action>
             </n-action-activator>`,
    })

    await page.waitForChanges()

    const activator = page.body.querySelector('n-action-activator')
    expect(activator).toBeDefined()

    const link = page.body.querySelector('a')

    let command = null
    actionBus.on('test', e => {
      command = e
    })

    link?.click()

    await page.waitForChanges()

    expect(command).toBeNull()

    activator?.remove()
  })
})
