jest.mock('../../services/common/logging')
//jest.mock('./media/timer')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { contentStateDispose } from '../../services/content'
import { addDataProvider } from '../../services/data/factory'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { dataState } from '../../services/data/state'
import {
  navigationState,
  navigationStateDispose,
} from '../../services/navigation/state'
import { View } from '../n-view/view'
import { ViewRouter } from '../n-views/views'
import { ViewPrompt } from './view-prompt'

describe('n-view-prompt', () => {
  let storage: InMemoryProvider

  beforeEach(async () => {
    dataState.enabled = true
    commonState.dataEnabled = true
    commonState.actionsEnabled = true
    commonState.elementsEnabled = true
    storage = new InMemoryProvider()
    addDataProvider('storage', storage)
  })

  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    storage.changed.removeAllListeners()
    navigationStateDispose()
    contentStateDispose()
    commonStateDispose()
  })

  it('renders inactive', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test/',
      html: `<n-views>
        <n-view path='/foo'>
          <n-view-prompt path="/go">
          </n-view-prompt>
        </n-view>
      </n-views>`,
    })

    expect(page.win.location.pathname).toBe('/')

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view path="/foo">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <n-view-prompt hidden="" path="/foo/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view-prompt>
      </n-view>
    </n-views>
    `)

    page.body.querySelector('n-view-prompt')!.remove()
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })

  it('renders active', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test.com/',
      html: `
      <n-views>
        <n-view path='/'>
          <n-view-prompt path="go">
            <a n-next>Next</a>
          </n-view-prompt>
          <div slot="content">
            Hello
          </div>
        </n-view>
      </n-views>`,
      autoApplyChanges: true,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view class="active " path="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content">
          </slot>
        </mock:shadow-root>
        <n-view-prompt class="active exact" path="/go" >
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <a n-attached-click="" n-attached-keydown="" n-next="">Next</a>
        </n-view-prompt>
        <div slot="content">
            Hello
          </div>
      </n-view>
    </n-views>
    `)

    const router = navigationState!.router!
    expect(router.location.pathname).toBe('/go')

    router.goToParentRoute()

    expect(router.location.pathname).toBe('/')

    page.body.querySelector('n-view-prompt')!.remove()
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })

  it('navigate two steps and back to home', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test.com/',
      html: `<n-views start-path='/start'>
        <n-view path='/start'>
          <n-view-prompt path="step-1">
            <a id='s1' n-next>NEXT</a>
          </n-view-prompt>
          <n-view-prompt path="step-2">
            <a id='b2' n-back>BACK</a>
            <a id='s2' n-next>NEXT</a>
          </n-view-prompt>
          done!
        </n-view>
      </n-views>`,
    })

    const router = navigationState!.router!

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    router.goToParentRoute()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-2')

    router.goToParentRoute()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start')

    page.body
      .querySelectorAll('n-view-prompt')
      .forEach(e => e!.remove())
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })

  it('navigate forward, then back', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test/',
      html: `<n-views start-path='/start'>
        <n-view path='/start'>
          <n-view-prompt path="step-1">
            <a id='s1' n-next>NEXT</a>
          </n-view-prompt>
          <n-view-prompt path="step-2">
            <a id='b2' href="step-1">BACK</a>
            <a id='s2' n-next>NEXT</a>
          </n-view-prompt>
          done!
        </n-view>
      </n-views>`,
    })

    const router = navigationState!.router!

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    router.goToParentRoute()

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-2')

    router.goToRoute('step-1')

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    page.body
      .querySelectorAll('n-view-prompt')
      .forEach(e => e!.remove())
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })

  it('hide if no router', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test/',
      html: `<n-view>
        <n-view-prompt path="/go">
        </n-view-prompt>
      </n-view>
      `,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-view>
      <mock:shadow-root>
        <slot></slot>
        <slot name="content"></slot>
      </mock:shadow-root>
      <n-view-prompt hidden="" path="/go" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view-prompt>
    </n-view>
      `)

    page.body.querySelector('n-view')!.remove()
  })

  it('hide if no parent', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test/',
      html: `
      <n-view-prompt path="/go">
      </n-view-prompt>
      `,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-view-prompt hidden="" path="/go" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view-prompt>
      `)

    page.body.querySelector('n-view-prompt')!.remove()
  })

  it('renders remote content', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test.com/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1>`),
      }),
    )

    page.setContent(`
    <n-views>
      <n-view path="/">
        <n-view-prompt content-src="fake.html" path="/test">
        </n-view-prompt>
      </n-view>
    </n-views>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view class="active" path="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <n-view-prompt class="active exact" content-src="fake.html" path="/test">
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
            <div id="rem-content-fakehtml">
              <h1>
                HI WORLD!
              </h1>
            </div>
          </n-view-prompt>
        </n-view>
      </n-views>
      `)

    page.body
      .querySelectorAll('n-view-prompt')
      .forEach(e => e!.remove())
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })

  it('renders empty remote content', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(null),
      }),
    )

    page.setContent(`
    <n-views>
      <n-view path="/">
        <n-view-prompt content-src="fake.html" path="/test">
        </n-view-prompt>
      </n-view>
    </n-views>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view class="active" path="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <n-view-prompt class="active exact" content-src="fake.html" path="/test">
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
          </n-view-prompt>
        </n-view>
      </n-views>
      `)
    page.body
      .querySelectorAll('n-view-prompt')
      .forEach(e => e!.remove())
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })

  it('renders remote content with tokens replace', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test.com/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI {{storage:name}}!</h1>`),
      }),
    )

    await storage.set('name', 'Jolene')

    page.setContent(`
    <n-views>
      <n-view path="/">
        <n-view-prompt content-src="fake.html" path="/test" resolve-tokens>
        </n-view-prompt>
      </n-view>
    </n-views>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view class="active" path="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <n-view-prompt class="active exact" content-src="fake.html" path="/test" resolve-tokens>
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
            <div id="rem-content-fakehtml">
              <h1>
                HI Jolene!
              </h1>
            </div>
          </n-view-prompt>
        </n-view>
      </n-views>
      `)

    page.body
      .querySelectorAll('n-view-prompt')
      .forEach(e => e!.remove())
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })

  it('uses internal video tag for time', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt],
      url: 'http://test/test',
    })

    page.setContent(`
    <n-views>
      <n-view path="/">
        <n-view-prompt path="/test"
          video-target="#video">
          <video id="video"></video>
        </n-view-prompt>
      </n-view>
    </n-views>
    `)

    await page.waitForChanges()

    page.body
      .querySelectorAll('n-view-prompt')
      .forEach(e => e!.remove())
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-views')!.remove()
  })
})
