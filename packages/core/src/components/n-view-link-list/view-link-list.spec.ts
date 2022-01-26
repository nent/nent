jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { dataStateDispose } from '../../services/data/state'
import { ViewLink } from '../n-view-link/view-link'
import { View } from '../n-view/view'
import { routingStateDispose } from '../n-views/services/state'
import { ViewRouter } from '../n-views/views'
import { ViewLinkList } from './view-link-list'

describe('n-view-link-list', () => {
  beforeEach(() => {
    commonState.dataEnabled = true
  })
  afterEach(() => {
    dataStateDispose()
    commonStateDispose()
    routingStateDispose()
    eventBus.removeAllListeners()
  })
  it('renders single home route', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkList, ViewLink],
      html: `
      <n-views>
        <n-view-link-list></n-view-link-list>
        <n-view path="/" page-title="Home"></n-view>
      </n-views>`,
    })

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view-link-list>
        <ol>
          <li>
            <n-view-link>
              <a class="active" href="/" n-attached-click="">
                Home
              </a>
            </n-view-link>
          </li>
        </ol>
      </n-view-link-list>
      <n-view class="active exact" page-title="Home" path="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
    </n-views>
    `)

    page.root?.remove()
  })

  it('renders single home route, late router init', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkList, ViewLink],
      html: `
      <div>
        <n-view-link-list></n-view-link-list>
        <n-views>
          <n-view path="/" page-title="Home"></n-view>
        </n-views>
      </div>
      `,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`

      <n-view-link-list>
        <ol>
          <li>
            <n-view-link>
              <a class="active" href="/" n-attached-click="">
                Home
              </a>
            </n-view-link>
          </li>
        </ol>
      </n-view-link-list>

    `)

    page.root?.remove()
  })

  it('renders multiple deep route', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkList, ViewLink],
      html: `
      <n-views>
        <n-view-link-list></n-view-link-list>
        <n-view path="/home" page-title="Home">
        </n-view>
        <n-view path="/home/page1" page-title="Page 1"></n-view>
      </n-views>`,
      url: 'http://local.com/home/page1',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view-link-list>
        <ol>
          <li>
            <n-view-link>
              <a href="/home" n-attached-click="">
                Home
              </a>
            </n-view-link>
          </li>
          <li>
            <n-view-link>
              <a class="active" href="/home/page1" n-attached-click="">
                Page 1
              </a>
            </n-view-link>
          </li>
        </ol>
      </n-view-link-list>
      <n-view class="active " page-title="Home" path="/home">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
      <n-view class="active exact" page-title="Page 1" path="/home/page1">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
    </n-views>
    `)

    page.root?.remove()
  })

  it('renders sibling routes', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkList, ViewLink],
      html: `
      <n-views>
        <n-view-link-list mode="siblings"></n-view-link-list>
        <n-view path="/home" page-title="Home">
        </n-view>
        <n-view path="/page1" page-title="Page 1">
        </n-view>
      </n-views>`,
      url: 'http://local.com/home',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view-link-list  mode="siblings">
        <ol>
          <li>
            <n-view-link>
              <a class="active" href="/home" n-attached-click="">
                Home
              </a>
            </n-view-link>
          </li>
          <li>
            <n-view-link>
              <a href="/page1" n-attached-click="">
                Page 1
              </a>
            </n-view-link>
          </li>
        </ol>
      </n-view-link-list>
      <n-view class="active exact" page-title="Home" path="/home">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
      <n-view page-title="Page 1" path="/page1">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
    </n-views>
    `)

    page.root?.remove()
  })

  it('renders children routes', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkList, ViewLink],
      html: `
      <n-views>
        <n-view-link-list mode="children"></n-view-link-list>
        <n-view path="/" page-title="Home">

          <n-view path="/page1" page-title="Page 1">
          </n-view>
          <n-view path="/page2" page-title="Page 2">
          </n-view>
        </n-view>

      </n-views>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view-link-list mode="children">
        <ol>
          <li>
            <n-view-link>
              <a href="/page1" n-attached-click="">
                Page 1
              </a>
            </n-view-link>
          </li>
          <li>
            <n-view-link>
              <a href="/page2" n-attached-click="">
                Page 2
              </a>
            </n-view-link>
          </li>
        </ol>
      </n-view-link-list>
      <n-view class="active exact" page-title="Home" path="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <n-view page-title="Page 1" path="/page1">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view page-title="Page 2" path="/page2">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
      </n-view>

    </n-views>
    `)

    page.root?.remove()
  })

  it('renders dynamic route', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkList, ViewLink],
      html: `
      <n-views>
        <n-view-link-list></n-view-link-list>
        <n-view path="/home" page-title="Home">
        </n-view>
        <n-view path="/home/:item" page-title="{{route:item}}"></n-view>
      </n-views>`,
      url: 'http://local.com/home/dogs',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view-link-list>
        <ol>
          <li>
            <n-view-link>
              <a href="/home" n-attached-click="">
                Home
              </a>
            </n-view-link>
          </li>
          <li>
            <n-view-link>
              <a class="active" href="/home/dogs" n-attached-click="">
                dogs
              </a>
            </n-view-link>
          </li>
        </ol>
      </n-view-link-list>
      <n-view class="active " page-title="Home" path="/home">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
      <n-view class="active exact" page-title="{{route:item}}" path="/home/:item">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
    </n-views>
    `)

    page.root?.remove()
  })

  it('renders multiple deep route with root', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkList, ViewLink],
      html: `
      <n-views>
        <n-view-link-list></n-view-link-list>
        <n-view path="/" page-title="Root">
        </n-view>
        <n-view path="/home" page-title="Home">
        </n-view>
        <n-view path="/home/page1" page-title="Page 1"></n-view>
      </n-views>`,
      url: 'http://local.com/home/page1',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view-link-list>
        <ol>
          <li>
            <n-view-link>
              <a href="/" n-attached-click="">
                Root
              </a>
            </n-view-link>
          </li>
          <li>
            <n-view-link>
              <a href="/home" n-attached-click="">
                Home
              </a>
            </n-view-link>
          </li>
          <li>
            <n-view-link>
              <a class="active" href="/home/page1" n-attached-click="">
                Page 1
              </a>
            </n-view-link>
          </li>
        </ol>
      </n-view-link-list>
      <n-view class="active " page-title="Root" path="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
      <n-view class="active " page-title="Home" path="/home">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
      <n-view class="active exact" page-title="Page 1" path="/home/page1">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
    </n-views>
    `)

    page.root?.remove()
  })
})
