jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import { addDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { ContentData } from './content-template'

describe('n-content-template', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    dataState.enabled = true
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    dataStateDispose()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [ContentData],
      html: `<n-content-template text="foo"></n-content-template>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-template text="foo">
        <span class="dynamic">
          foo
        </span>
      </n-content-template>
    `)
    const subject = page.body.querySelector('n-content-template')
    subject?.remove()
  })

  it('renders child template', async () => {
    const page = await newSpecPage({
      components: [ContentData],
      html: `<n-content-template>
              <template>
                <p>Hello Jason!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <div class="dynamic">
          <p>Hello Jason!</p>
        </div>
      </n-content-template>
    `)

    const subject = page.body.querySelector('n-content-template')
    subject?.remove()
  })

  it('renders inline data to child template', async () => {
    const page = await newSpecPage({
      components: [ContentData],
      html: `<n-content-template>
              <script type="application/json">
              { "name": "Forrest" }
              </script>
              <template>
                <p>Hello {{data:name}}!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <div class="dynamic">
          <p>Hello Forrest!</p>
        </div>
      </n-content-template>
    `)

    const subject = page.body.querySelector('n-content-template')
    subject?.remove()
  })

  it('renders session data to child template', async () => {
    await session.set('name', 'Tom')
    const page = await newSpecPage({
      components: [ContentData],
      html: `<n-content-template>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <div class="dynamic">
        <p>Hello Tom!</p>
        </div>
      </n-content-template>
    `)

    const subject = page.body.querySelector('n-content-template')
    subject?.remove()
  })

  it('renders session, responds when changes', async () => {
    await session.set('name', 'Tom')
    const page = await newSpecPage({
      components: [ContentData],
      html: `<n-content-template>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <div class="dynamic">
          <p>Hello Tom!</p>
        </div>
      </n-content-template>
    `)

    await session.set('name', 'Tomy')
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <div class="dynamic">
          <p>Hello Tomy!</p>
        </div>
      </n-content-template>
    `)

    const subject = page.body.querySelector('n-content-template')
    subject?.remove()
  })
})
