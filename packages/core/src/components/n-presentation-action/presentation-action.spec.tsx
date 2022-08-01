jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
import { newSpecPage } from '@stencil/core/testing'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/actions'
import { sleep } from '../../services/common'
import { PresentationTimer } from '../n-presentation-timer/presentation-timer'
import { Presentation } from '../n-presentation/presentation'
import { PresentationAction } from './presentation-action'

describe('n-presentation-action', () => {
  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [PresentationAction],
      html: `<n-presentation-action></n-presentation-action>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-action>

      </n-presentation-action>
    `)
  })

  it('missing command', async () => {
    const page = await newSpecPage({
      components: [PresentationAction],
      html: `<n-presentation-action topic="test"></n-presentation-action>`,
    })
    let action = await page.root!.getAction()

    expect(action).toBeNull()
  })

  it('missing topic', async () => {
    const page = await newSpecPage({
      components: [PresentationAction],
      html: `<n-presentation-action command="do"></n-presentation-action>`,
    })
    let action = await page.root!.getAction()

    expect(action).toBeNull()
  })

  it('get-action & send-action', async () => {
    const page = await newSpecPage({
      components: [PresentationAction],
      html: `<n-presentation-action topic="test" time="1" command="do" ></n-presentation-action>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-action topic="test" time="1" command="do">
      </n-presentation-action>
    `)

    let action = await page.root!.getAction()

    expect(action.topic).toBe('test')
    expect(action.command).toBe('do')

    let sentAction: EventAction<any> | null = null
    actionBus.on('test', e => {
      sentAction = e
    })

    await page.root!.sendAction({ appends: true })

    expect(sentAction).not.toBeNull()

    expect(sentAction!.topic).toBe('test')
    expect(sentAction!.command).toBe('do')
    expect(sentAction!.data.appends).toBeTruthy()
  })

  it('send-action happens only once', async () => {
    const sentActions: Array<EventAction<any>> = []
    actionBus.on('test', e => {
      sentActions.push(e)
    })
    const page = await newSpecPage({
      components: [
        Presentation,
        PresentationTimer,
        PresentationAction,
      ],
      html: `<div></div>`,
    })

    await page.setContent(`
      <n-presentation>
        <n-presentation-timer duration="4" interval="0">
        </n-presentation-timer>
        <n-presentation-action time="2" topic="test" command="do">
        </n-presentation-action>
      </n-presentation>
    `)

    await page.waitForChanges()

    await sleep(1000)
    await page.waitForChanges()

    await sleep(1000)
    await page.waitForChanges()

    expect(sentActions.length).toBe(1)

    await sleep(1000)
    await page.waitForChanges()

    await sleep(1000)
    await page.waitForChanges()

    expect(sentActions.length).toBe(1)

    const sentAction = sentActions[0]

    expect(sentAction).toBeDefined()
    expect(sentAction.topic).toBe('test')
    expect(sentAction.command).toBe('do')
  })
})
