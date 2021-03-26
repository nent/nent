jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { navigationState } from '../../services/navigation/state'
import { ActionActivator } from '../n-action-activator/action-activator'
import { Action } from '../n-action/action'
import { ViewRouter } from '../n-views/views'
import { View } from './view'

describe('n-view', () => {
  beforeEach(() => {
    commonState.actionsEnabled = true
    commonState.dataEnabled = true
  })
  afterEach(() => {
    commonStateDispose()
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View],
      html: `<n-views >
        <n-view url='/'>
        </n-view>
       </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view class="active exact" url="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
      </n-views>
    `)

    page.root?.remove()
  })

  it('renders remote route html', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () =>
          Promise.resolve(`<h1>HI WORLD!</h1>
        <div slot="content">Content</div>`),
      }),
    )

    page.setContent(`
    <n-views>
      <n-view src="fake.html" url="/test">
      </n-view>
    </n-views>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view class="active exact" src="fake.html" url="/test">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <h1>HI WORLD!</h1>
        <div slot="content">Content</div>
      </n-view>
    </n-views>
      `)

    page.root?.remove()
  })

  it('renders remote content', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1>`),
      }),
    )

    page.setContent(`
    <n-views>
      <n-view content-src="fake.html" url="/test">
      </n-view>
    </n-views>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view class="active exact" content-src="fake.html" url="/test">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <div id="rem-content-fakehtml">
          <h1>
            HI WORLD!
          </h1>
        </div>
      </n-view>
    </n-views>
      `)

    page.root?.remove()
  })

  it('removes remote content after navigation', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View],
      url: 'http://test/test',
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1>`),
      }),
    )

    page.setContent(`
    <n-views>
      <n-view content-src="fake.html" url="/test">
      </n-view>
      <n-view url="/bye">
        <h1>Hi</h1>
      </n-view>
    </n-views>
    `)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view class="active exact" content-src="fake.html" url="/test">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <div id="rem-content-fakehtml">
          <h1>
            HI WORLD!
          </h1>
        </div>
      </n-view>
      <n-view url="/bye">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <h1>Hi</h1>
      </n-view>
    </n-views>
      `)

    const router = navigationState!.router

    router!.goToRoute('/bye')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-views>
      <n-view  content-src="fake.html" url="/test">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
      </n-view>
      <n-view class="active exact" url="/bye">
         <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <h1>Hi</h1>
      </n-view>
    </n-views>
      `)

    page.root?.remove()
  })

  it('activates own actions, only', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ActionActivator, Action],
      url: 'http://test/',
      html: `
    <n-views>
      <n-view url="/">
        <n-view url="lev-1">
          <n-view url="lev-2">
            <n-action-activator activate="on-enter">
              <n-action topic="test" command="doit" data-data="level-3">
              </n-action>
            </n-action-activator>
          </n-view>
          <n-action-activator activate="on-enter">
            <n-action topic="test" command="doit" data-data="level-2">
          </n-action>
        </n-action-activator>
        </n-view>
        <n-action-activator activate="on-enter">
          <n-action topic="test" command="doit" data-data="level-1">
          </n-action>
        </n-action-activator>
      </n-view>
    </n-views>
    `,
    })

    await page.waitForChanges()

    const views = page.body.querySelectorAll('n-view')

    const root = views[0]
    let children = await root.getChildren()

    expect(children.activators.length).toBe(1)
    expect(children.views.length).toBe(1)
    expect(children.dos.length).toBe(0)

    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'fake',
    })

    const lev1 = views[1]
    children = await lev1.getChildren()

    expect(children.activators.length).toBe(1)
    expect(children.views.length).toBe(1)
    expect(children.dos.length).toBe(0)

    const lev2 = views[2]
    children = await lev2.getChildren()

    expect(children.activators.length).toBe(1)
    expect(children.views.length).toBe(0)
    expect(children.dos.length).toBe(0)

    views.forEach(e => e.remove())
    page.root?.remove()
  })
})
