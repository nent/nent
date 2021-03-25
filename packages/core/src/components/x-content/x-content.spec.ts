jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  contentStateDispose,
  contentStateReset,
} from '../../services/content'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import {
  dataState,
  dataStateDispose,
  dataStateReset,
} from '../../services/data/state'
import { XContent } from './x-content'

describe('x-content', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    jest.resetAllMocks()
    session = new InMemoryProvider()
    addDataProvider('session', session)
    contentStateReset()
    dataStateReset()
    dataState.enabled = true
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    clearDataProviders()
    contentStateDispose()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContent],
      html: `<x-content></x-content>`,
    })
    expect(page.root).toEqualHtml(`
      <x-content hidden="">
      </x-content>
    `)
  })

  it('renders html from remote', async () => {
    const page = await newSpecPage({
      components: [XContent],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    page.setContent(`<x-content src="fake.html"></x-content>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content>
    `)

    const subject = page.body.querySelector('x-content')
    subject?.remove()
  })

  it('handles erroring html from remote', async () => {
    const page = await newSpecPage({
      components: [XContent],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.reject('Error!'),
      }),
    )

    page.setContent(`<x-content src="fake.html"></x-content>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content hidden="" src="fake.html">
       </x-content>
    `)

    const subject = page.body.querySelector('x-content')
    subject?.remove()
  })

  it('handles http error in html from remote', async () => {
    const page = await newSpecPage({
      components: [XContent],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 400,
        text: () => Promise.resolve('Error!'),
      }),
    )

    page.setContent(`<x-content src="fake.html"></x-content>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content hidden="" src="fake.html">
       </x-content>
    `)

    const subject = page.body.querySelector('x-content')
    subject?.remove()
  })

  it('renders html from remote, delayed', async () => {
    const page = await newSpecPage({
      components: [XContent],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    // @ts-ignore
    page.win.Prism = {
      highlightAllUnder: jest.fn().mockImplementation(),
    }

    page.setContent(
      `<x-content defer-load src="fake.html"></x-content>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content defer-load hidden="" src="fake.html">
       </x-content>
    `)

    const subject = page.body.querySelector('x-content')
    subject?.removeAttribute('defer-load')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content>
    `)

    subject?.remove()
  })

  it('renders html conditionally', async () => {
    const page = await newSpecPage({
      components: [XContent],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    await page.setContent(
      `<x-content when="false" src="fake.html"></x-content>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content when="false" hidden="" src="fake.html">
      </x-content>
    `)

    const subject = page.body.querySelector('x-content')
    subject?.setAttribute('when', 'true')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content when="true" src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content>
    `)

    subject?.remove()
  })

  it('renders html conditionally, from data expression', async () => {
    const page = await newSpecPage({
      components: [XContent],
    })

    page.win.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    await page.setContent(
      `<x-content when="{{session:render}}" src="fake.html"></x-content>`,
    )

    expect(page.root).toEqualHtml(`
      <x-content when="{{session:render}}" hidden="" src="fake.html">
      </x-content>
    `)

    await session.set('render', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content when="{{session:render}}" src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </x-content>
    `)

    const subject = page.body.querySelector('x-content')
    subject?.remove()
  })

  it('renders tokens in remote data', async () => {
    const page = await newSpecPage({
      components: [XContent],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          Promise.resolve(`<h1>HI {{session:name?FRIEND}}!</h1> `),
      }),
    )

    await page.setContent(`<x-content src="fake.html"></x-content>`)

    expect(page.root).toEqualHtml(`
      <x-content src="fake.html">
        <div class="remote-content">
          <h1>
            HI FRIEND!
          </h1>
        </div>
      </x-content>
    `)

    await session.set('name', 'MAX')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content src="fake.html">
        <div class="remote-content">
          <h1>
          HI MAX!
          </h1>
        </div>
      </x-content>
    `)

    const subject = page.body.querySelector('x-content')
    subject?.remove()
  })
})
