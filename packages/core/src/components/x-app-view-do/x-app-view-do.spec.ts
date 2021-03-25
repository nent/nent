jest.mock('../../services/common/logging')
//jest.mock('./media/timer')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { contentStateDispose } from '../../services/content'
import { addDataProvider } from '../../services/data/factory'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { dataState } from '../../services/data/state'
import { navigationStateDispose } from '../../services/navigation'
import { XAppView } from '../x-app-view/x-app-view'
import { XApp } from '../x-app/x-app'
import { XAppViewDo } from './x-app-view-do'

describe('x-app-view-do', () => {
  let storage: InMemoryProvider
  dataState.enabled = true
  beforeEach(async () => {
    storage = new InMemoryProvider()
    addDataProvider('storage', storage)
  })

  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    storage.changed.removeAllListeners()
    navigationStateDispose()
    contentStateDispose()
  })

  it('renders inactive', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `<x-app>
        <x-app-view url='/foo'>
          <x-app-view-do url="/go">
          </x-app-view-do>
        </x-app-view>
      </x-app>`,
    })

    expect(page.win.location.pathname).toBe('/')

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view url="/foo">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <x-app-view-do hidden="" url="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    page.body.querySelector('x-app-view-do')!.remove()
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })

  it('renders active', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `
      <x-app>
        <x-app-view url='/'>
          <x-app-view-do url="go">
            <a x-next>Next</a>
          </x-app-view-do>
          <div slot="content">
            Hello
          </div>
        </x-app-view>
      </x-app>`,
      autoApplyChanges: true,
    })

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view class="active-route" url="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content">
          </slot>
        </mock:shadow-root>
        <x-app-view-do class="active-route active-route-exact" url="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <a x-attached-click="" x-attached-keydown="" x-next="">Next</a>
        </x-app-view-do>
        <div slot="content">
            Hello
          </div>
      </x-app-view>
    </x-app>
    `)

    const router = page.body.querySelector('x-app')!.router
    expect(router.location.pathname).toBe('/go')

    router.goToParentRoute()

    expect(router.location.pathname).toBe('/')

    page.body.querySelector('x-app-view-do')!.remove()
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })

  it('navigate two steps and back to home', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `<x-app start-url='/start'>
        <x-app-view url='/start'>
          <x-app-view-do url="step-1">
            <a id='s1' x-next>NEXT</a>
          </x-app-view-do>
          <x-app-view-do url="step-2">
            <a id='b2' x-back>BACK</a>
            <a id='s2' x-next>NEXT</a>
          </x-app-view-do>
          done!
        </x-app-view>
      </x-app>`,
    })

    const router = page.body.querySelector('x-app')!.router

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    router.goToParentRoute()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-2')

    router.goToParentRoute()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start')

    page.body
      .querySelectorAll('x-app-view-do')
      .forEach(e => e!.remove())
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })

  it('navigate forward, then back', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `<x-app start-url='/start'>
        <x-app-view url='/start'>
          <x-app-view-do url="step-1">
            <a id='s1' x-next>NEXT</a>
          </x-app-view-do>
          <x-app-view-do url="step-2">
            <a id='b2' href="step-1">BACK</a>
            <a id='s2' x-next>NEXT</a>
          </x-app-view-do>
          done!
        </x-app-view>
      </x-app>`,
    })

    const router = page.body.querySelector('x-app')!.router

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    router.goToParentRoute()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-2')

    router.goToRoute('step-1')

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    page.body
      .querySelectorAll('x-app-view-do')
      .forEach(e => e!.remove())
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })

  it('hide if no router', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `<x-app-view>
        <x-app-view-do url="/go">
        </x-app-view-do>
      </x-app-view>
      `,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-app-view>
      <mock:shadow-root>
        <slot></slot>
        <slot name="content"></slot>
      </mock:shadow-root>
      <x-app-view-do hidden="" url="/go" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view-do>
    </x-app-view>
      `)

    page.body.querySelector('x-app-view')!.remove()
  })

  it('hide if no parent', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/',
      html: `
      <x-app-view-do url="/go">
      </x-app-view-do>
      `,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app-view-do hidden="" url="/go" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view-do>
      `)

    page.body.querySelector('x-app-view-do')!.remove()
  })

  it('renders remote content', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1>`),
      }),
    )

    page.setContent(`
    <x-app>
      <x-app-view url="/">
        <x-app-view-do content-src="fake.html" url="/test">
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view class="active-route" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <x-app-view-do class="active-route active-route-exact" content-src="fake.html" url="/test">
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
            <div id="remote-content-fakehtml">
              <h1>
                HI WORLD!
              </h1>
            </div>
          </x-app-view-do>
        </x-app-view>
      </x-app>
      `)

    page.body
      .querySelectorAll('x-app-view-do')
      .forEach(e => e!.remove())
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })

  it('renders empty remote content', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(null),
      }),
    )

    page.setContent(`
    <x-app>
      <x-app-view url="/">
        <x-app-view-do content-src="fake.html" url="/test">
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view class="active-route" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <x-app-view-do class="active-route active-route-exact" content-src="fake.html" url="/test">
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
          </x-app-view-do>
        </x-app-view>
      </x-app>
      `)
    page.body
      .querySelectorAll('x-app-view-do')
      .forEach(e => e!.remove())
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })

  it('renders remote content with tokens replace', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI {{storage:name}}!</h1>`),
      }),
    )

    await storage.set('name', 'Jolene')

    page.setContent(`
    <x-app>
      <x-app-view url="/">
        <x-app-view-do content-src="fake.html" url="/test" resolve-tokens>
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-app>
        <x-app-view class="active-route" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <x-app-view-do class="active-route active-route-exact" content-src="fake.html" url="/test" resolve-tokens>
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
            <div id="remote-content-fakehtml">
              <h1>
                HI Jolene!
              </h1>
            </div>
          </x-app-view-do>
        </x-app-view>
      </x-app>
      `)

    page.body
      .querySelectorAll('x-app-view-do')
      .forEach(e => e!.remove())
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })

  it('uses internal video tag for time', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo],
      url: 'http://test/test',
    })

    page.setContent(`
    <x-app>
      <x-app-view url="/">
        <x-app-view-do url="/test"
          video-target="#video">
          <video id="video"></video>
        </x-app-view-do>
      </x-app-view>
    </x-app>
    `)

    await page.waitForChanges()

    page.body
      .querySelectorAll('x-app-view-do')
      .forEach(e => e!.remove())
    page.body.querySelector('x-app-view')!.remove()
    page.body.querySelector('x-app')!.remove()
  })
})
