jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import { commonState } from '../../services/common'
import { addDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { ContentTemplate } from './content-template'

describe('n-content-template', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    dataState.enabled = true
    session = new InMemoryProvider()
    addDataProvider('session', session)
    commonState.dataEnabled = true
    commonState.routingEnabled = true
  })

  afterEach(() => {
    dataStateDispose()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders, delayed enable', async () => {
    commonState.dataEnabled = false
    commonState.routingEnabled = false

    const page = await newSpecPage({
      components: [ContentTemplate],
      html: `<n-content-template text="{{session:foo}}"></n-content-template>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
    <n-content-template text="{{session:foo}}">
    <span class="dynamic">
    </span>
  </n-content-template>
    `)

    await session.set('foo', 'bar')
    commonState.dataEnabled = true
    commonState.routingEnabled = true

    await page.waitForChanges()

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-content-template text="{{session:foo}}">
      <span class="dynamic">
        bar
      </span>
    </n-content-template>
    `)

    page.root?.remove()
  })

  it('renders simple strings', async () => {
    const page = await newSpecPage({
      components: [ContentTemplate],
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
      components: [ContentTemplate],
      html: `<n-content-template>
              <template>
                <p>Hello Jason!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <template>
          <p>Hello Jason!</p>
        </template>
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
      components: [ContentTemplate],
      html: `<n-content-template>
              <script type="application/json">{ "name": "Forrest" }</script>
              <template>
                <p>Hello {{data:name}}!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <script type="application/json">{ "name": "Forrest" }</script><template>
          <p>Hello {{data:name}}!</p>
        </template>
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
      components: [ContentTemplate],
      html: `<n-content-template>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <template>
          <p>Hello {{session:name}}!</p>
        </template>
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
      components: [ContentTemplate],
      html: `<n-content-template>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </n-content-template>`,
    })

    expect(page.root).toEqualHtml(`
      <n-content-template>
        <template>
          <p>Hello {{session:name}}!</p>
        </template>
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
        <template>
          <p>Hello {{session:name}}!</p>
        </template>
        <div class="dynamic">
          <p>Hello Tomy!</p>
        </div>
      </n-content-template>
    `)

    const subject = page.body.querySelector('n-content-template')
    subject?.remove()
  })
})
