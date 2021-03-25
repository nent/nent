jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
jest.mock('./markdown/remarkable.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { contentStateDispose } from '../../services/content'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { dataState } from '../../services/data/state'
import { XContentMarkdown } from './x-content-markdown'

describe('x-content-markdown', () => {
  let session: InMemoryProvider

  dataState.enabled = true
  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
    clearDataProviders()
    contentStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
      html: `<x-content-markdown></x-content-markdown>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-content-markdown hidden="">
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders markup from inline md', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.setContent(
      `<x-content-markdown>
        <script>
          # Hello
        </script>
       </x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown>
        <script>
          # Hello
        </script>
        <div class="rendered-content">
          <h1>
          Hello
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders empty markup from inline md', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
      html: `<x-content-markdown>
      <script>
      </script>
     </x-content-markdown>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown>
        <script>
        </script>
        <div class="rendered-content"></div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders markup from remote', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI WORLD! `),
      }),
    )

    page.setContent(
      `<x-content-markdown src="fake.md"></x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('handles erroring markup from remote', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.reject('Error!'),
      }),
    )

    page.setContent(
      `<x-content-markdown src="fake.md"></x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown hidden="" src="fake.md">
       </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('handles http error in markup from remote', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 400,
        text: () => Promise.resolve('Error!'),
      }),
    )

    page.setContent(
      `<x-content-markdown src="fake.md"></x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown hidden="" src="fake.md">
       </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders markup from remote, delayed', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI WORLD! `),
      }),
    )

    // @ts-ignore
    page.win.Prism = {
      highlightAllUnder: jest.fn().mockImplementation(),
    }

    page.setContent(
      `<x-content-markdown defer-load src="fake.md"></x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown defer-load hidden="" src="fake.md">
       </x-content-markdown>
    `)

    const md = page.body.querySelector('x-content-markdown')
    md?.removeAttribute('defer-load')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    md?.remove()
  })

  it('renders markup conditionally', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI WORLD! `),
      }),
    )

    await page.setContent(
      `<x-content-markdown when="false" src="fake.md"></x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown when="false" hidden="" src="fake.md">
      </x-content-markdown>
    `)

    const md = page.body.querySelector('x-content-markdown')
    md?.setAttribute('when', 'true')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown when="true" src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    md?.remove()
  })

  it('renders markup conditionally, from data expression', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI WORLD! `),
      }),
    )

    await page.setContent(
      `<x-content-markdown when="{{session:render}}" src="fake.md"></x-content-markdown>`,
    )

    expect(page.root).toEqualHtml(`
      <x-content-markdown when="{{session:render}}" hidden="" src="fake.md">
      </x-content-markdown>
    `)

    await session.set('render', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-markdown when="{{session:render}}" src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders tokens from data expression', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    await session.set('name', 'Jane')

    await page.setContent(
      `<x-content-markdown resolve-tokens>
        <script>
          # Hello {{session:name}}
        </script>
       </x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <x-content-markdown resolve-tokens>
        <script>
          # Hello {{session:name}}
        </script>
        <div class="rendered-content">
          <h1>
          Hello Jane
          </h1>
        </div>
      </x-content-markdown>
    `)

    await session.set('name', 'John')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <x-content-markdown resolve-tokens>
        <script>
          # Hello {{session:name}}
        </script>
        <div class="rendered-content">
          <h1>
          Hello John
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })

  it('renders tokens from data expressions in remote markdown', async () => {
    const page = await newSpecPage({
      components: [XContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI {{session:name}}! `),
      }),
    )

    await session.set('name', 'Jane')

    await page.setContent(
      `<x-content-markdown resolve-tokens src="fake.md"></x-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <x-content-markdown resolve-tokens src="fake.md">
        <div class="rendered-content">
          <h1>
          HI Jane!
          </h1>
        </div>
      </x-content-markdown>
    `)

    await session.set('name', 'John')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <x-content-markdown resolve-tokens src="fake.md">
        <div class="rendered-content">
          <h1>
          HI John!
          </h1>
        </div>
      </x-content-markdown>
    `)

    const subject = page.body.querySelector('x-content-markdown')
    subject?.remove()
  })
})
