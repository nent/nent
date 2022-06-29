jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')
jest.mock('../../services/data/jsonata.worker')
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
import remoteData from './test/data.json'

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

  it('renders and responds to changing data', async () => {
    const page = await newSpecPage({
      components: [ContentTemplate],
    })
    page.win.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ name: 'Tester' }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ name: 'Tester 2' }),
        }),
      )
    await page.setContent(`<n-content-template src="data.json" no-cache>
         <template><b>{{data:name}}</b></template>
       </n-content-template>`)
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
       <n-content-template src="data.json" no-cache>
         <template><b>{{data:name}}</b></template>
         <div class="dynamic">
           <b>Tester</b>
         </div>
       </n-content-template>
     `)

    eventBus.emit(DATA_EVENTS.DataChanged, {})
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
       <n-content-template src="data.json" no-cache>
         <template><b>{{data:name}}</b></template>
         <div class="dynamic">
           <b>Tester 2</b>
         </div>
       </n-content-template>
     `)
    page.root?.remove()
  })

  it('handles erroring remote data', async () => {
    const page = await newSpecPage({
      components: [ContentTemplate],
    })
    page.win.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 404,
          json: () => Promise.resolve(null),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.reject('error'),
        }),
      )
    await page.setContent(`<n-content-template src="data.json">
        <template><b>{{data:name}}</b></template>
      </n-content-template>`)
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-content-template src="data.json">
        <template><b>{{data:name}}</b></template>
        <div class="dynamic">
           <b></b>
         </div>
      </n-content-template>
    `)

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-content-template src="data.json">
        <template><b>{{data:name}}</b></template>
        <div class="dynamic">
          <b></b>
        </div>
      </n-content-template>
    `)
    page.root?.remove()
  })

  it('filter remote json', async () => {
    const page = await newSpecPage({
      components: [ContentTemplate],
    })
    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(remoteData),
      }),
    )
    await page.setContent(`
    <n-content-template src="data.json" filter="Account.Order[0].Product[0].SKU">
      <template><b>{{data:item}}</b></template>
    </n-content-template>`)
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-content-template src="data.json" filter="Account.Order[0].Product[0].SKU">
        <template><b>{{data:item}}</b></template>
        <div class="dynamic">
          <b>0406654608</b>
        </div>
      </n-content-template>
    `)
    page.root?.remove()
  })

  it('renders graphql json', async () => {
    const page = await newSpecPage({
      components: [ContentTemplate],
    })
    let options: any = {}
    page.win.fetch = jest
      .fn()
      .mockImplementation((...args: any[]) => {
        ;[, options] = args
        return Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              value: 'Hello!',
            }),
        })
      })

    await page.setContent(`
      <n-content-template src="http://data.com/api" graphql>
        <script>
        query { value }
        </script>
        <template><b>{{data:value}}</b></template>
      </n-content-template>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-template src="http://data.com/api" graphql>
        <script>
        query { value }
        </script>
        <template><b>{{data:value}}</b></template>
        <div class="dynamic">
          <b>Hello!</b>
        </div>
      </n-content-template>
    `)

    expect(options.method).toBe('POST')
    expect(options.body).toBe('{"query":"query { value }\\n"}')
    page.root?.remove()
  })
})
