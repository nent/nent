jest.mock('../../services/common/logging')
import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { App } from './app'

describe('n-app', () => {
  beforeEach(() => {
    actionBus.events['*'] = []
    eventBus.events['*'] = []
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app></n-app>`,
    })
    expect(page.root).toEqualHtml(`
      <n-app>
      </n-app>
    `)

    expect(actionBus.events['*'].length).toBe(1)
    expect(eventBus.events['*'].length).toBe(1)

    page.root?.remove()
  })

  it('renders in debug mode', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app debug></n-app>`,
    })
    expect(page.root).toEqualHtml(`
      <n-app debug="">
      </n-app>
    `)
    expect(actionBus.events['*'].length).toBe(1)
    expect(eventBus.events['*'].length).toBe(1)

    page.root?.remove()
  })

  it('actions and events are delegated to DOM', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app></n-app>`,
    })
    expect(page.root).toEqualHtml(`
      <n-app>
      </n-app>
    `)

    expect(actionBus.events['*'].length).toBe(1)
    expect(eventBus.events['*'].length).toBe(1)

    const eventsDetected = []
    const actionsDetected = []

    const app = page.root as HTMLNAppElement

    app.addEventListener('nent:events', (e: any) => {
      eventsDetected.push(e.detail)
    })

    app.addEventListener('nent:actions', (e: any) => {
      actionsDetected.push(e.detail)
    })

    actionBus.emit('fake-action', { value: 1 })

    expect(actionsDetected.length).toBe(1)

    eventBus.emit('fake-event', { value: 1 })

    expect(eventsDetected.length).toBe(1)

    page.root?.remove()
  })

  it('actions are delegated from DOM', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app></n-app>`,
    })
    expect(page.root).toEqualHtml(`
      <n-app>
      </n-app>
    `)

    const actionsDetected = []

    actionBus.on('fake-action', e => {
      actionsDetected.push(e)
    })

    page.body.dispatchEvent(
      new CustomEvent('nent:actions', {
        detail: {
          topic: 'fake-action',
          command: 'fake',
        },
      }),
    )

    expect(actionsDetected.length).toBe(1)

    page.root?.remove()
  })
})
