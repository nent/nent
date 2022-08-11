jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/data/jsonata.worker')
jest.mock('./services/remarkable.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common/state'
import { contentStateDispose } from '../../services/content'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { ContentMarkdown } from './content-markdown'

describe('n-content-markdown', () => {
  let session: InMemoryProvider

  commonState.dataEnabled = true
  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
    commonState.dataEnabled = true
    commonState.routingEnabled = true
    commonState.elementsEnabled = true
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
    clearDataProviders()
    contentStateDispose()
    commonStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
      html: `<n-content-markdown></n-content-markdown>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <n-content-markdown hidden="">
      </n-content-markdown>
    `)

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    page.root?.remove()
  })

  it('renders, delayed enable', async () => {
    commonState.dataEnabled = false
    commonState.routingEnabled = false

    const page = await newSpecPage({
      components: [ContentMarkdown],
      html: `<n-content-markdown></n-content-markdown>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <n-content-markdown hidden="">
      </n-content-markdown>
    `)

    commonState.dataEnabled = true
    commonState.routingEnabled = true

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    page.root?.remove()
  })

  it('renders markup from inline md', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.setContent(
      `<n-content-markdown>
        <script>
          # Hello
        </script>
       </n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown>
        <script>
          # Hello
        </script>
        <div class="rendered-content">
          <h1>
          Hello
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders empty markup from inline md', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
      html: `<n-content-markdown>
      <script>
      </script>
     </n-content-markdown>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown>
        <script>
        </script>
        <div class="rendered-content"></div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders markup from remote', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI WORLD! `),
      }),
    )

    page.setContent(
      `<n-content-markdown src="fake.md"></n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('handles erroring markup from remote', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.reject('Error!'),
      }),
    )

    page.setContent(
      `<n-content-markdown src="fake.md"></n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown hidden="" src="fake.md">
       </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('handles http error in markup from remote', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 400,
        text: () => Promise.resolve('Error!'),
      }),
    )

    page.setContent(
      `<n-content-markdown src="fake.md"></n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown hidden="" src="fake.md">
       </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders markup from remote, delayed', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
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
      `<n-content-markdown defer-load src="fake.md"></n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown defer-load hidden="" src="fake.md">
       </n-content-markdown>
    `)

    const md = page.body.querySelector('n-content-markdown')
    md?.removeAttribute('defer-load')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders markup conditionally', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI WORLD! `),
      }),
    )

    await page.setContent(
      `<n-content-markdown when="false" src="fake.md"></n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown when="false" hidden="" src="fake.md">
      </n-content-markdown>
    `)

    const md = page.body.querySelector('n-content-markdown')
    md?.setAttribute('when', 'true')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown when="true" src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders markup conditionally, from data expression', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI WORLD! `),
      }),
    )

    await page.setContent(
      `<n-content-markdown when="{{session:render}}" src="fake.md"></n-content-markdown>`,
    )

    expect(page.root).toEqualHtml(`
      <n-content-markdown when="{{session:render}}" hidden="" src="fake.md">
      </n-content-markdown>
    `)

    await session.set('render', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown when="{{session:render}}" src="fake.md">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders tokens from data expression', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    await session.set('name', 'Jane')

    await page.setContent(
      `<n-content-markdown resolve-tokens>
        <script>
          # Hello {{session:name}}
        </script>
       </n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <n-content-markdown resolve-tokens>
        <script>
          # Hello {{session:name}}
        </script>
        <div class="rendered-content">
          <h1>
          Hello Jane
          </h1>
        </div>
      </n-content-markdown>
    `)

    await session.set('name', 'John')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <n-content-markdown resolve-tokens>
        <script>
          # Hello {{session:name}}
        </script>
        <div class="rendered-content">
          <h1>
          Hello John
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders tokens from data expressions in remote markdown', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# HI {{session:name}}! `),
      }),
    )

    await session.set('name', 'Jane')

    await page.setContent(
      `<n-content-markdown resolve-tokens src="fake.md"></n-content-markdown>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <n-content-markdown resolve-tokens src="fake.md">
        <div class="rendered-content">
          <h1>
          HI Jane!
          </h1>
        </div>
      </n-content-markdown>
    `)

    await session.set('name', 'John')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <n-content-markdown resolve-tokens src="fake.md">
        <div class="rendered-content">
          <h1>
          HI John!
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders markup from JSON, using a data expression', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`{ "data": "# HI WORLD! "}`),
      }),
    )

    await page.setContent(
      `<n-content-markdown json="data" src="fake.json"></n-content-markdown>`,
    )

    expect(page.root).toEqualHtml(`
      <n-content-markdown json="data" src="fake.json">
        <div class="rendered-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })

  it('renders URLs as external links', async () => {
    const page = await newSpecPage({
      components: [ContentMarkdown],
      html: `
      <n-content-markdown>
        <script>https://google.com</script>
     </n-content-markdown>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-markdown>
        <script>https://google.com</script>
        <div class="rendered-content">
         <p>
          <a href="https://google.com" target="_blank">https://google.com</a>
         </p>
        </div>
      </n-content-markdown>
    `)

    page.root?.remove()
  })
})
