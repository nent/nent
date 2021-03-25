jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { XAppView } from '../x-app-view/x-app-view'
import { XApp } from '../x-app/x-app'
import { XAppViewNotFound } from './x-app-view-not-found'

describe('x-app-view-not-found', () => {
  beforeEach(() => {})
  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.useRealTimers()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppViewNotFound],
      html: `<x-app>
        <x-app-view-not-found>
          <h1>Not Found</h1>
        </x-app-view-not-found>
       </x-app>`,
      autoApplyChanges: true,
    })

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view-not-found>
          <h1>Not Found</h1>
        </x-app-view-not-found>
      </x-app>
    `)

    page.body.querySelector('x-app-view-not-found')!.remove()
    page.root!.remove()
  })

  it('renders page title', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppViewNotFound],
      html: `<x-app app-title="Much?">
        <x-app-view-not-found page-title="Lost">
          <h1>Not Found</h1>
        </x-app-view-not-found>
       </x-app>`,
    })
    await page.waitForChanges()

    expect(page.win.document.title).toBe('Lost | Much?')

    page.body.querySelector('x-app-view-not-found')!.remove()
    page.root!.remove()
  })

  it('renders page transitions from app', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppViewNotFound],
      html: `<x-app transition="slide">
        <x-app-view-not-found>
          <h1>Not Found</h1>
        </x-app-view-not-found>
       </x-app>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-app transition="slide">
        <x-app-view-not-found class="slide">
          <h1>Not Found</h1>
        </x-app-view-not-found>
      </x-app>
    `)

    page.body.querySelector('x-app-view-not-found')!.remove()
    page.root!.remove()
  })

  it('hides when a route is found', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewNotFound],
      html: `<x-app>
        <x-app-view url='/'>
        </x-app-view>
        <x-app-view-not-found>
          <h1>Not Found</h1>
        </x-app-view-not-found>
       </x-app>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view class="active-route active-route-exact" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view>
        <x-app-view-not-found hidden="">
          <h1>Not Found</h1>
        </x-app-view-not-found>
      </x-app>
    `)
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app-view-not-found')!.remove()
    page.root!.remove()
  })

  it('hides when a route is found, then shows with a bad route navigation', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewNotFound],
      html: `<x-app>
        <x-app-view url='/home'>
        </x-app-view>
        <x-app-view-not-found>
          <h1>Not Found</h1>
        </x-app-view-not-found>
       </x-app>`,
      url: 'http://foo.com/',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view url="/home">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view>
        <x-app-view-not-found>
          <h1>Not Found</h1>
        </x-app-view-not-found>
      </x-app>
    `)

    const app = page.root as HTMLXAppElement
    expect(app).not.toBeUndefined()
    const router = app!.router

    expect(router).not.toBeUndefined()

    router.goToRoute('/home')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view class="active-route active-route-exact" url="/home">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view>
        <x-app-view-not-found hidden="">
          <h1>Not Found</h1>
        </x-app-view-not-found>
      </x-app>
    `)

    router.goToRoute('/foo')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view  url="/home">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view>
        <x-app-view-not-found>
          <h1>Not Found</h1>
        </x-app-view-not-found>
      </x-app>
    `)

    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app-view-not-found')!.remove()
    page.root!.remove()
  })
})
