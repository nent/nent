jest.mock('./filter/jsonata.worker')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { contentStateDispose } from '../../services/content'
import { addDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { ROUTE_EVENTS } from '../../services/routing'
import remoteData from './test/data.json'
import { XDataRepeat } from './x-data-repeat'

describe('x-data-repeat', () => {
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
      components: [XDataRepeat],
      html: `<x-data-repeat defer-load><div></div></x-data-repeat>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data-repeat defer-load="">
        <div></div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('render inline array', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat items="[1,2,3]">
              <template><b>{{data:item}}</b></template>
             </x-data-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items="[1,2,3]">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </x-data-repeat>
    `)
    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('render inline array from tokens', async () => {
    addDataProvider('some', provider)
    provider.set('list', '[0, 9, 8, 7]')

    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat items="{{some:list}}">
              <template><b>{{data:item}}</b></template>
             </x-data-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items="{{some:list}}">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>0</b>
          <b>9</b>
          <b>8</b>
          <b>7</b>
        </div>
      </x-data-repeat>
    `)
    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('render scripted array', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
      html: `<x-data-repeat>
        <script type="text/json">
        ["dogs", "cats", "bears", "birds"]
        </script>
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat>
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
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('render remote json', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([1, 2, 3]),
      }),
    )

    await page.setContent(`<x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('renders and responds to changing data', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
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

    await page.setContent(`<x-data-repeat items-src="items.json" no-cache>
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json" no-cache>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
        </div>
      </x-data-repeat>
    `)

    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json" no-cache>
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>1</b>
          <b>2</b>
          <b>3</b>
          <b>4</b>
          <b>5</b>
        </div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('handles erroring remote data', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
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

    await page.setContent(`<x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>
    `)

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="items.json">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })

  it('filter remote json', async () => {
    const page = await newSpecPage({
      components: [XDataRepeat],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(remoteData),
      }),
    )

    await page.setContent(`<x-data-repeat items-src="data.json" filter="[Account.Order.Product.SKU]">
        <template><b>{{data:item}}</b></template>
      </x-data-repeat>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-repeat items-src="data.json" filter="[Account.Order.Product.SKU]">
        <template><b>{{data:item}}</b></template>
        <div class="data-content">
          <b>0406654608</b>
          <b>0406634348</b>
          <b>040657863</b>
          <b>0406654603</b>
        </div>
      </x-data-repeat>
    `)

    const subject = page.body.querySelector('x-data-repeat')
    subject?.remove()
  })
})
