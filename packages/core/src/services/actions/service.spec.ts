jest.mock('../common/logging')
jest.mock('../data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, EventAction } from '.'
import { Action } from '../../components/n-action/action'
import { App } from '../../components/n-app/app'
import { Data } from '../../components/n-data/data'
import { Elements } from '../../components/n-elements/elements'

describe('ActionService', () => {
  beforeEach(() => {})
  afterEach(() => {
    actionBus.removeAllListeners()
  })

  it('getAction', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action
            topic='test'
            command='do-test'
            data-value='foo'>
          </n-action>`,
    })

    await page.waitForChanges()

    const actionEl = page.root as HTMLNActionElement

    const action = await actionEl.getAction()

    expect(action).toBeDefined()
    expect(action!.topic).toBe('test')
    expect(action!.command).toBe('do-test')
    expect(action!.data['value']).toBe('foo')

    page.root?.remove()
  })

  it('getAction:token-value', async () => {
    const page = await newSpecPage({
      components: [App, Data, Elements, Action],
      html: `
        <n-app>
          <n-data></n-data>
          <n-elements></n-elements>
          <input id="test" value="3"/>
          <n-action
            topic='test'
            command='do-test'
            data-value='{{elements:test}}'>
          </n-action>
        </n-app>`,
    })

    await page.waitForChanges()

    const actionEl = page.root?.querySelector(
      'n-action',
    ) as HTMLNActionElement

    const action = await actionEl.getAction()

    expect(action).toBeDefined()
    expect(action!.topic).toBe('test')
    expect(action!.command).toBe('do-test')
    expect(action!.data['value']).toBe('3')

    page.root?.remove()
  })

  it('sendAction', async () => {
    const actions: EventAction<any>[] = []
    actionBus.on('*', (event: string, action: EventAction<any>) => {
      action.topic = event
      actions.push(action)
    })

    const page = await newSpecPage({
      components: [Action],
      html: `<n-action
            topic='test'
            command='do-test'
            data-value='foo'>
          </n-action>`,
    })

    await page.waitForChanges()

    const actionEl = page.root as HTMLNActionElement

    await actionEl.sendAction()

    expect(actions).toHaveLength(1)

    const action = actions[0]

    expect(action).toBeDefined()
    expect(action!.topic).toBe('test')
    expect(action!.command).toBe('do-test')
    expect(action!.data['value']).toBe('foo')

    page.root?.remove()
  })
})
