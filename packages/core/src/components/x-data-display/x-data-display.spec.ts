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
import { XDataDisplay } from './x-data-display'

describe('x-data-display', () => {
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
      components: [XDataDisplay],
      html: `<x-data-display text="foo"></x-data-display>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-display text="foo">
        <span class="dynamic">
          foo
        </span>
      </x-data-display>
    `)
    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })

  it('renders child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <template>
                <p>Hello Jason!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display>
        <div class="dynamic">
          <p>Hello Jason!</p>
        </div>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })

  it('renders inline data to child template', async () => {
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <script type="application/json">
              { "name": "Forrest" }
              </script>
              <template>
                <p>Hello {{data:name}}!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display>
        <div class="dynamic">
          <p>Hello Forrest!</p>
        </div>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })

  it('renders session data to child template', async () => {
    await session.set('name', 'Tom')
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display>
        <div class="dynamic">
        <p>Hello Tom!</p>
        </div>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })

  it('renders session, responds when changes', async () => {
    await session.set('name', 'Tom')
    const page = await newSpecPage({
      components: [XDataDisplay],
      html: `<x-data-display>
              <template>
                <p>Hello {{session:name}}!</p>
              </template>
             </x-data-display>`,
    })

    expect(page.root).toEqualHtml(`
      <x-data-display>
        <div class="dynamic">
          <p>Hello Tom!</p>
        </div>
      </x-data-display>
    `)

    await session.set('name', 'Tomy')
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-display>
        <div class="dynamic">
          <p>Hello Tomy!</p>
        </div>
      </x-data-display>
    `)

    const subject = page.body.querySelector('x-data-display')
    subject?.remove()
  })
})
