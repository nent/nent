jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')
jest.mock('../n-content-repeat/filter/jsonata.worker')
import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { addDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { dataStateDispose } from '../../services/data/state'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { ContentTemplate } from './content-template'
describe('n-content-template', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    commonState.dataEnabled = true
    commonState.routingEnabled = true
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    eventBus.removeAllListeners()
    commonStateDispose()
    dataStateDispose()
    jest.resetAllMocks()
  })

  it('renders, delayed enable', async () => {
    commonState.dataEnabled = false
    commonState.routingEnabled = false

    const page = await newSpecPage({
      components: [ContentTemplate],
      html: `<n-content-template text="{{session:foo}}"></n-content-template>`,
    })
    expect(page.root).toEqualHtml(`
    <n-content-template text="{{session:foo}}">
      <span class="dynamic">
        {{session:foo}}
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

  //  it('render remote json', async () => {
  //    const page = await newSpecPage({
  //      components: [ContentTemplate],
  //    })
  //
  //    page.win.fetch = jest.fn().mockImplementation(() =>
  //      Promise.resolve({
  //        status: 200,
  //        json: () => Promise.resolve([1, 2, 3]),
  //      }),
  //    )
  //
  //    await page.setContent(`<n-content-template src="items.json">
  //        <template><b>{{data:item}}</b></template>
  //      </n-content-template>`)
  //
  //    await page.waitForChanges()
  //
  //    expect(page.root).toEqualHtml(`
  //      <n-content-template src="items.json">
  //        <template><b>{{data:item}}</b></template>
  //        <div class="data-content">
  //          <b>1</b>
  //        </div>
  //      </n-content-template>
  //    `)
  //
  //    page.root?.remove()
  //  })
  //
  //  it('renders and responds to changing data', async () => {
  //    const page = await newSpecPage({
  //      components: [ContentTemplate],
  //    })
  //
  //    page.win.fetch = jest
  //      .fn()
  //      .mockImplementationOnce(() =>
  //        Promise.resolve({
  //          status: 200,
  //          json: () => Promise.resolve([1, 2, 3]),
  //        }),
  //      )
  //      .mockImplementationOnce(() =>
  //        Promise.resolve({
  //          status: 200,
  //          json: () => Promise.resolve([1, 2, 3, 4, 5]),
  //        }),
  //      )
  //
  //    await page.setContent(`<n-content-template src="items.json" no-cache>
  //        <template><b>{{data:item}}</b></template>
  //      </n-content-template>`)
  //
  //    await page.waitForChanges()
  //
  //    expect(page.root).toEqualHtml(`
  //      <n-content-template src="items.json" no-cache>
  //        <template><b>{{data:item}}</b></template>
  //        <div class="data-content">
  //          <b>1</b>
  //        </div>
  //      </n-content-template>
  //    `)
  //
  //    eventBus.emit(DATA_EVENTS.DataChanged, {})
  //
  //    await page.waitForChanges()
  //
  //    expect(page.root).toEqualHtml(`
  //      <n-content-template src="items.json" no-cache>
  //        <template><b>{{data:item}}</b></template>
  //        <div class="data-content">
  //          <b>1</b>
  //        </div>
  //      </n-content-template>
  //    `)
  //
  //    page.root?.remove()
  //  })
  //
  // it('handles erroring remote data', async () => {
  //   const page = await newSpecPage({
  //     components: [ContentTemplate],
  //   })
  //
  //   page.win.fetch = jest
  //     .fn()
  //     .mockImplementationOnce(() =>
  //       Promise.resolve({
  //         status: 404,
  //         json: () => Promise.resolve(null),
  //       }),
  //     )
  //     .mockImplementationOnce(() =>
  //       Promise.resolve({
  //         status: 200,
  //         json: () => Promise.reject('error'),
  //       }),
  //     )
  //
  //   await page.setContent(`<n-content-template src="items.json">
  //       <template><b>{{data:item}}</b></template>
  //     </n-content-template>`)
  //
  //   await page.waitForChanges()
  //
  //   expect(page.root).toEqualHtml(`
  //     <n-content-template src="items.json">
  //       <template><b>{{data:item}}</b></template>
  //     </n-content-template>
  //   `)
  //
  //   eventBus.emit(ROUTE_EVENTS.RouteChanged, {})
  //
  //   await page.waitForChanges()
  //
  //   expect(page.root).toEqualHtml(`
  //     <n-content-template src="items.json">
  //       <template><b>{{data:item}}</b></template>
  //     </n-content-template>
  //   `)
  //
  //   page.root?.remove()
  // })
  //
  // it('filter remote json', async () => {
  //   const page = await newSpecPage({
  //     components: [ContentTemplate],
  //   })
  //
  //   page.win.fetch = jest.fn().mockImplementation(() =>
  //     Promise.resolve({
  //       status: 200,
  //       json: () => Promise.resolve(remoteData),
  //     }),
  //   )
  //
  //   await page.setContent(`<n-content-template src="data.json" filter="[Account.Order.Product.SKU]">
  //       <template><b>{{data:item}}</b></template>
  //     </n-content-template>`)
  //
  //   await page.waitForChanges()
  //
  //   expect(page.root).toEqualHtml(`
  //     <n-content-template src="data.json" filter="[Account.Order.Product.SKU][0]">
  //       <template><b>{{data:item}}</b></template>
  //       <div class="data-content">
  //         <b>0406654608</b>
  //       </div>
  //     </n-content-template>
  //   `)
  //
  //   page.root?.remove()
  // })
})
