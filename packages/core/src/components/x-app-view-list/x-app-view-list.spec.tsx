jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { commonStateDispose } from '../../services/common'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { XAppLink } from '../x-app-link/x-app-link'
import { XAppView } from '../x-app-view/x-app-view'
import { XApp } from '../x-app/x-app'
import { XAppViewList } from './x-app-view-list'
describe('x-app-view-list', () => {
  beforeEach(() => {
    dataState.enabled = true
  })
  afterEach(() => {
    dataStateDispose()
    commonStateDispose()
  })
  it('renders single home route', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewList, XAppLink],
      html: `
      <x-app>
        <x-app-view-list></x-app-view-list>
        <x-app-view url="/" page-title="Home"></x-app-view>
      </x-app>`,
    })

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view-list>
        <ol>
          <li>
            <x-app-link>
              <a class="link-active" href="/" x-attached-click="">
                Home
              </a>
            </x-app-link>
          </li>
        </ol>
      </x-app-view-list>
      <x-app-view class="active-route active-route-exact" page-title="Home" url="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
    </x-app>
    `)

    page.root?.remove()
  })

  it('renders multiple deep route', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewList, XAppLink],
      html: `
      <x-app>
        <x-app-view-list></x-app-view-list>
        <x-app-view url="/home" page-title="Home">
        </x-app-view>
        <x-app-view url="/home/page1" page-title="Page 1"></x-app-view>
      </x-app>`,
      url: 'http://local.com/home/page1',
    })

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view-list>
        <ol>
          <li>
            <x-app-link>
              <a href="/home" x-attached-click="">
                Home
              </a>
            </x-app-link>
          </li>
          <li>
            <x-app-link>
              <a class="link-active" href="/home/page1" x-attached-click="">
                Page 1
              </a>
            </x-app-link>
          </li>
        </ol>
      </x-app-view-list>
      <x-app-view class="active-route" page-title="Home" url="/home">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
      <x-app-view class="active-route active-route-exact" page-title="Page 1" url="/home/page1">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
    </x-app>
    `)

    page.root?.remove()
  })

  it('renders dynamic route', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewList, XAppLink],
      html: `
      <x-app>
        <x-app-view-list></x-app-view-list>
        <x-app-view url="/home" page-title="Home">
        </x-app-view>
        <x-app-view url="/home/:item" page-title="{{route:item}}"></x-app-view>
      </x-app>`,
      url: 'http://local.com/home/dogs',
    })

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view-list>
        <ol>
          <li>
            <x-app-link>
              <a href="/home" x-attached-click="">
                Home
              </a>
            </x-app-link>
          </li>
          <li>
            <x-app-link>
              <a class="link-active" href="/home/:item" x-attached-click="">
                dogs
              </a>
            </x-app-link>
          </li>
        </ol>
      </x-app-view-list>
      <x-app-view class="active-route" page-title="Home" url="/home">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
      <x-app-view class="active-route active-route-exact" page-title="{{route:item}}" url="/home/:item">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
    </x-app>
    `)

    page.root?.remove()
  })

  it('renders multiple deep route with root', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewList, XAppLink],
      html: `
      <x-app>
        <x-app-view-list></x-app-view-list>
        <x-app-view url="/" page-title="Root">
        </x-app-view>
        <x-app-view url="/home" page-title="Home">
        </x-app-view>
        <x-app-view url="/home/page1" page-title="Page 1"></x-app-view>
      </x-app>`,
      url: 'http://local.com/home/page1',
    })

    expect(page.root).toEqualHtml(`
    <x-app>
      <x-app-view-list>
        <ol>
          <li>
            <x-app-link>
              <a href="/" x-attached-click="">
                Root
              </a>
            </x-app-link>
          </li>
          <li>
            <x-app-link>
              <a href="/home" x-attached-click="">
                Home
              </a>
            </x-app-link>
          </li>
          <li>
            <x-app-link>
              <a class="link-active" href="/home/page1" x-attached-click="">
                Page 1
              </a>
            </x-app-link>
          </li>
        </ol>
      </x-app-view-list>
      <x-app-view class="active-route" page-title="Root" url="/">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
      <x-app-view class="active-route" page-title="Home" url="/home">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
      <x-app-view class="active-route active-route-exact" page-title="Page 1" url="/home/page1">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </x-app-view>
    </x-app>
    `)

    page.root?.remove()
  })
})
