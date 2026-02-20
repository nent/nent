jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/actions'
import { sleep } from '../../services/common'
import { Action } from '../n-action/action'
import { PresentationTimer } from '../n-presentation-timer/presentation-timer'
import { RequestAnimationFrameMockSession } from '../n-presentation/mocks/animationFrame'
import { Presentation } from '../n-presentation/presentation'
import { ActionActivator } from './action-activator'

describe('n-action-activator', () => {
  //let requestAnimationFrameMock: RequestAnimationFrameMockSession

  beforeEach(() => {
    //requestAnimationFrameMock = new RequestAnimationFrameMockSession()
  })

  afterEach(() => {
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
      `<n-action-activator style="display: contents;">
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
      `<n-action-activator style="display: contents;">
        <n-action topic="fake" command="noop"></n-action>
      </n-action-activator>`,
    )

    page.root?.remove()
  })

  it('render event', async () => {
    let action: EventAction<any>
    actionBus.on('fake', e => {
      action = e
    })
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator activate="on-render">
              <n-action topic="fake" command="noop"></n-action>
             </n-action-activator>`,
      hydrateClientSide: true,
    })

    await page.waitForChanges()
    await sleep(1000)

    expect(action!).toBeDefined()

    page.root?.remove()
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

    page.root?.remove()
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

    page.root?.remove()
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

    page.root?.remove()
  })

  it('fails with invalid child input values', async () => {
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<n-action-activator activate="on-element-event" target-element="button" >
               <n-action topic="test" command="pass"></n-action>
               <input type="text" name="text" required />
               <button type="button">Click Me</button>
             </n-action-activator>`,
    })

    await page.waitForChanges()

    const activator = page.body.querySelector('n-action-activator')
    expect(activator).toBeDefined()

    const button = page.body.querySelector('button')

    const input = page.body.querySelector('input')
    input!.checkValidity = () => false

    let eventAction: EventAction<any> | null = null
    actionBus.on('test', e => {
      eventAction = e
    })

    button?.click()

    await page.waitForChanges()

    expect(eventAction).toBeNull()

    page.root?.remove()
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

  it('timed-actions only send once', async () => {
    const sentActions: Array<EventAction<any>> = []
    actionBus.on('test', e => {
      sentActions.push(e)
    })

    const page = await newSpecPage({
      components: [
        Presentation,
        PresentationTimer,
        ActionActivator,
        Action,
      ],
      html: `
        <n-presentation>
          <n-presentation-timer duration="8" interval="0">
          </n-presentation-timer>
          <n-action-activator activate="at-time" time="2">
            <n-action topic="test" command="do"></n-action>
          </n-action-activator>
        </n-presentation>
      `,
      hydrateClientSide: true,
    })
    await page.waitForChanges()

    await sleep(1500)
    await page.waitForChanges()

    await sleep(1500)
    await page.waitForChanges()

    expect(sentActions.length).toBe(1)

    await sleep(1000)
    await page.waitForChanges()

    expect(sentActions.length).toBe(1)

    const sentAction = sentActions[0]

    expect(sentAction).toBeDefined()
    expect(sentAction.topic).toBe('test')
    expect(sentAction.command).toBe('do')

    page.root?.remove()
  }, 15000)
})
