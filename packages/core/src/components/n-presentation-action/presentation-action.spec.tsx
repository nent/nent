jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
import { newSpecPage } from '@stencil/core/testing'
import {
  actionBus,
  EventAction,
  eventBus,
} from '../../services/actions'
import { NPresentationAction } from './presentation-action'

describe('n-presentation-action', () => {
  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NPresentationAction],
      html: `<n-presentation-action></n-presentation-action>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-action>

      </n-presentation-action>
    `)
  })

  it('missing command', async () => {
    const page = await newSpecPage({
      components: [NPresentationAction],
      html: `<n-presentation-action topic="test"></n-presentation-action>`,
    })
    let action = await page.root!.getAction()

    expect(action).toBeNull()
  })

  it('missing topic', async () => {
    const page = await newSpecPage({
      components: [NPresentationAction],
      html: `<n-presentation-action command="do"></n-presentation-action>`,
    })
    let action = await page.root!.getAction()

    expect(action).toBeNull()
  })

  it('get-action & send-action', async () => {
    const page = await newSpecPage({
      components: [NPresentationAction],
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
})
