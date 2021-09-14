jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { View } from '../n-view/view'
import {
  routingState,
  routingStateDispose,
} from '../n-views/services/state'
import { ViewRouter } from '../n-views/views'
import { ViewNotFound } from './view-not-found'

describe('n-view-not-found', () => {
  beforeEach(() => {})
  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    routingStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, ViewNotFound],
      html: `<n-views>
        <n-view-not-found>
          <h1>Not Found</h1>
        </n-view-not-found>
       </n-views>`,
      autoApplyChanges: true,
    })

    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view-not-found>
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <h1>Not Found</h1>
        </n-view-not-found>
      </n-views>
    `)

    page.body.querySelector('n-view-not-found')!.remove()
    page.root!.remove()
  })

  it('renders page title', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, ViewNotFound],
      html: `<n-views>
        <n-view-not-found page-title="Lost">
          <h1>Not Found</h1>
        </n-view-not-found>
       </n-views>`,
    })
    await page.waitForChanges()

    expect(page.win.document.title).toBe('Lost |')

    page.body.querySelector('n-view-not-found')!.remove()
    page.root!.remove()
  })

  it('renders page transitions from app', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, ViewNotFound],
      html: `<n-views transition="slide">
        <n-view-not-found>
          <h1>Not Found</h1>
        </n-view-not-found>
       </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views transition="slide">
        <n-view-not-found class="slide">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <h1>Not Found</h1>
        </n-view-not-found>
      </n-views>
    `)

    page.body.querySelector('n-view-not-found')!.remove()
    page.root!.remove()
  })

  it('hides when a route is found', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewNotFound],
      html: `<n-views>
        <n-view path='/'>
        </n-view>
        <n-view-not-found>
          <h1>Not Found</h1>
        </n-view-not-found>
       </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view class="active exact" path="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-not-found hidden="">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <h1>Not Found</h1>
        </n-view-not-found>
      </n-views>
    `)
    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-view-not-found')!.remove()
    page.root!.remove()
  })

  it('hides when a route is found, then shows with a bad route navigation', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewNotFound],
      html: `<n-views>
        <n-view path='/home'>
        </n-view>
        <n-view-not-found>
          <h1>Not Found</h1>
        </n-view-not-found>
       </n-views>`,
      url: 'http://foo.com/',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view path="/home">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-not-found>
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <h1>Not Found</h1>
        </n-view-not-found>
      </n-views>
    `)

    const app = page.root as HTMLNViewsElement
    expect(app).not.toBeUndefined()
    const router = routingState?.router!

    expect(router).not.toBeUndefined()

    router.goToRoute('/home')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view class="active exact" path="/home">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-not-found hidden="">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <h1>Not Found</h1>
        </n-view-not-found>
      </n-views>
    `)

    router.goToRoute('/foo')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view path="/home">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-not-found>
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <h1>Not Found</h1>
        </n-view-not-found>
      </n-views>
    `)

    page.body.querySelector('n-view')!.remove()
    page.body.querySelector('n-view-not-found')!.remove()
    page.root!.remove()
  })
})
