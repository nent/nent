jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { commonStateDispose } from '../../services/common'
import { XElements } from '../x-elements/x-elements'
import { XApp } from './x-app'

describe('x-app', () => {
  afterEach(() => {
    commonStateDispose()
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('navigates to the start page', async () => {
    const page = await newSpecPage({
      components: [XApp],
      url: 'http://hello.com/',
      html: `<x-app start-url='/home'>
       <h1>Hello</h1>
     </x-app>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <x-app start-url='/home'>
    <h1>
      Hello
    </h1>
  </x-app>`)

    const app = page.body.querySelector('x-app')
    expect(app).not.toBeUndefined()
    const router = app?.router

    expect(router).not.toBeUndefined()

    expect(router!.history.location.pathname).toBe('/home')
    expect(router!.location.pathname).toBe('/home')

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('navigates to the start page, with root', async () => {
    const page = await newSpecPage({
      components: [XApp],
      url: 'http://hello.com/hello',
      html: `<x-app start-url='/home' root="/hello">
       <h1>Hello</h1>
     </x-app>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <x-app start-url='/home' root="/hello">
    <h1>
      Hello
    </h1>
  </x-app>`)

    const app = page.body.querySelector('x-app')
    const router = app?.router

    expect(router!.history.location.pathname).toBe('/home')

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('navigates to the start page, with root & hash', async () => {
    const page = await newSpecPage({
      components: [XApp],
      url: 'http://hello.com/hello',
      html: `<x-app hash start-url='/home' root="/hello">
       <h1>Hello</h1>
     </x-app>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <x-app hash start-url='/home' root="/hello">
    <h1>
      Hello
    </h1>
  </x-app>`)

    const app = page.body.querySelector('x-app')
    const router = app?.router

    expect(router!.history.location.pathname).toBe('/home')

    expect(page.win!.location.pathname).toBe('/hello')

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('navigates to the start page, with root & file extension', async () => {
    const page = await newSpecPage({
      components: [XApp],
      url: 'http://hello.com/path/hello.html',
      html: `<x-app start-url='/home' root="/path/hello.html">
       <h1>Hello</h1>
     </x-app>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <x-app start-url='/home' root="/path/hello.html">
    <h1>
      Hello
    </h1>
  </x-app>`)

    const app = page.body.querySelector('x-app')
    const router = app?.router

    expect(router!.history.location.pathname).toBe('/home')

    expect(page.win!.location.pathname).toBe('/path/hello.html')

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('renders and displays cloaked content', async () => {
    const page = await newSpecPage({
      components: [XApp, XElements],
      html: `<x-app app-title="Hello">
              <x-elements><div></div></x-elements>
              <div x-cloak></div>
            </x-app>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-app app-title="Hello">
        <x-elements>
        <div></div>
        </x-elements>
        <div></div>
      </x-app>
    `)

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('adds hidden to x-hide children', async () => {
    const page = await newSpecPage({
      components: [XApp, XElements],
      html: `<x-app app-title="Hello" debug>
              <x-elements>
              <div></div>
              </x-elements>
              <div x-hide></div>
            </x-app>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <x-app app-title="Hello" debug>
      <x-elements>
      <div></div>
      </x-elements>
      <div hidden></div>
    </x-app>
  `)

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })
})
