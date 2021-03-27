jest.mock('./filter/jsonata.worker')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { contentStateDispose } from '../../services/content'
import { addDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { ROUTE_EVENTS } from '../../services/routing/interfaces'
import { ContentDataRepeat } from './content-repeat'
import remoteData from './test/data.json'

describe('n-content-repeat', () => {
  let provider: InMemoryProvider
  beforeEach(() => {
    dataState.enabled = true
    provider = new InMemoryProvider()
  })

  afterEach(() => {
    dataStateDispose()
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
    contentStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentDataRepeat],
      html: `<n-content-repeat defer-load><div></div></n-content-repeat>`,
    })
    expect(page.root).toEqualHtml(`
      <n-content-repeat defer-load="">
        <div></div>
      </n-content-repeat>
    `)

    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })

  it('render inline array', async () => {
    const page = await newSpecPage({
      components: [ContentDataRepeat],
      html: `<n-content-repeat items="[1,2,3]">
              <template><b>{{data:item}}</b></template>
             </n-content-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items="[1,2,3]">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </n-content-repeat>
    `)
    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })

  it('render inline array from tokens', async () => {
    addDataProvider('some', provider)
    provider.set('list', '[0, 9, 8, 7]')

    const page = await newSpecPage({
      components: [ContentDataRepeat],
      html: `<n-content-repeat items="{{some:list}}">
              <template><b>{{data:item}}</b></template>
             </n-content-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items="{{some:list}}">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>0</b>
          <b>9</b>
          <b>8</b>
          <b>7</b>
        </div>
      </n-content-repeat>
    `)
    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })

  it('render scripted array', async () => {
    const page = await newSpecPage({
      components: [ContentDataRepeat],
      html: `<n-content-repeat>
        <script type="text/json">
        ["dogs", "cats", "bears", "birds"]
        </script>
        <template><b>{{data:item}}</b></template>
      </n-content-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat>
        <script type="text/json">
        ["dogs", "cats", "bears", "birds"]
        </script>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>dogs</b>
          <b>cats</b>
          <b>bears</b>
          <b>birds</b>
        </div>
      </n-content-repeat>
    `)

    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })

  it('render remote json', async () => {
    const page = await newSpecPage({
      components: [ContentDataRepeat],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([1, 2, 3]),
      }),
    )

    await page.setContent(`<n-content-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </n-content-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </n-content-repeat>
    `)

    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })

  it('renders and responds to changing data', async () => {
    const page = await newSpecPage({
      components: [ContentDataRepeat],
    })

    page.win.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve([1, 2, 3]),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve([1, 2, 3, 4, 5]),
        }),
      )

    await page.setContent(`<n-content-repeat items-src="items.json" no-cache>
        <template><b>{{data:item}}</b></template>
      </n-content-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items-src="items.json" no-cache>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </n-content-repeat>
    `)

    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items-src="items.json" no-cache>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
          <b>4</b>
          <b>5</b>
        </div>
      </n-content-repeat>
    `)

    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })

  it('handles erroring remote data', async () => {
    const page = await newSpecPage({
      components: [ContentDataRepeat],
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

    await page.setContent(`<n-content-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </n-content-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </n-content-repeat>
    `)

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </n-content-repeat>
    `)

    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })

  it('filter remote json', async () => {
    const page = await newSpecPage({
      components: [ContentDataRepeat],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(remoteData),
      }),
    )

    await page.setContent(`<n-content-repeat items-src="data.json" filter="[Account.Order.Product.SKU]">
        <template><b>{{data:item}}</b></template>
      </n-content-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-repeat items-src="data.json" filter="[Account.Order.Product.SKU]">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>0406654608</b>
          <b>0406634348</b>
          <b>040657863</b>
          <b>0406654603</b>
        </div>
      </n-content-repeat>
    `)

    const subject = page.body.querySelector('n-content-repeat')
    subject?.remove()
  })
})
