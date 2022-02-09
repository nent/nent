jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { ViewLink } from '../n-view-link/view-link'
import { ViewPrompt } from '../n-view-prompt/view-prompt'
import { View } from '../n-view/view'
import {
  routingState,
  routingStateDispose,
} from '../n-views/services/state'
import { ViewRouter } from '../n-views/views'
import { ViewLinkNext } from './view-link-next'

describe('n-view-link-next', () => {
  beforeEach(() => {
    commonState.dataEnabled = true
  })
  afterEach(() => {
    commonStateDispose()
    routingStateDispose()
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewLinkNext],
      html: `<n-view-link-next>Test</n-view-link-next>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-view-link-next>
        <n-view-link active-class="none" path="" validate="" >
          Test
        </n-view-link>
      </n-view-link-next>`)
  })

  it('render next view link', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkNext, ViewLink],
      html: `<n-views  start-path="/first">
              <n-view path='/first'>
                <n-view-link-next>
                  Next
                </n-view-link-next>
              </n-view>
              <n-view path='/second'>
              </n-view>
            </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views start-path="/first">
        <n-view class="active exact" path="/first">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <n-view-link-next>
            <n-view-link active-class="none" validate="">
              <a href="/second" n-attached-click="" n-attached-key-press="">
                Next
              </a>
            </n-view-link>
          </n-view-link-next>
        </n-view>
        <n-view path="/second">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
      </n-views>
    `)

    const link = page.body.querySelector(
      'n-view-link-next a',
    ) as HTMLAnchorElement
    expect(link).not.toBeUndefined()

    link!.click()

    await page.waitForChanges()

    expect(routingState.router!.location.pathname).toBe('/second')

    page.root!.remove()
  })

  it('render parent view link', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkNext],
      html: `<n-views >
        <n-view path='/parent'>
          <n-view path='/child'>
            <n-view-link-next>
              Next
            </n-view-link-next>
          </n-view>
        </n-view>
       </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view path="/parent">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <n-view path="/parent/child">
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
            <n-view-link-next>
              <n-view-link active-class="none" path="/parent" validate="">
                Next
              </n-view-link>
            </n-view-link-next>
          </n-view>
        </n-view>
      </n-views>
    `)

    page.root?.remove()
  })

  it('render parent view link from prompt', async () => {
    const page = await newSpecPage({
      components: [
        ViewRouter,
        View,
        ViewPrompt,
        ViewLinkNext,
        ViewLink,
      ],
      html: `<n-views >
        <n-view path='/'>
          <n-view-prompt path='/child'>
            <n-view-link-next>
              Next
            </n-view-link-next>
          </n-view-prompt>
        </n-view>
       </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view class="active" path="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <n-view-prompt class="active exact" path="/child">
            <mock:shadow-root>
              <slot></slot>
              <slot name="content"></slot>
            </mock:shadow-root>
            <n-view-link-next>
              <n-view-link active-class="none" validate="">
                <a class="none" href="/" n-attached-click="" n-attached-key-press="">
                  Next
                </a>
              </n-view-link>
            </n-view-link-next>
          </n-view-prompt>
        </n-view>
      </n-views>
    `)

    const link = page.body.querySelector(
      'n-view-link-next a',
    ) as HTMLAnchorElement
    expect(link).not.toBeUndefined()

    var event = new KeyboardEvent('keypress', { keyCode: 37 })
    link.dispatchEvent(event)

    expect(routingState.router?.location.pathname).toBe('/')

    page.root?.remove()
  })

  it('render next link from views', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkNext, ViewLink],
      html: `<n-views >
        <n-view path='/'>
        </n-view>
        <n-view path='/first'>
        </n-view>
        <n-view path='/second'>
        </n-view>
        <n-view-link-next>
          Next
        </n-view-link-next>
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
        <n-view path="/first">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view path="/second">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-link-next>
          <n-view-link active-class="none" validate="">
            <a href="/first" n-attached-click="" n-attached-key-press="">
              Next
            </a>
          </n-view-link>
        </n-view-link-next>
      </n-views>
    `)

    routingState.router?.goToRoute('/first')

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views>
        <n-view  class="active" path="/">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view class="active exact" path="/first">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view path="/second">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-link-next>
          <n-view-link active-class="none" validate="">
            <a href="/second" n-attached-click="" n-attached-key-press="">
              Next
            </a>
          </n-view-link>
        </n-view-link-next>
      </n-views>
    `)

    page.root?.remove()
  })

  it('validates inputs before navigation', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkNext, ViewLink],
      html: `<n-views >
        <n-view path='/'>
          <input type="email" required/>
        </n-view>
        <n-view path='/first'>
        </n-view>
        <n-view-link-next>
          Next
        </n-view-link-next>
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
          <input type="email" required/>
        </n-view>
        <n-view path="/first">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-link-next>
          <n-view-link active-class="none" validate="">
            <a href="/first" n-attached-click="" n-attached-key-press="">
              Next
            </a>
          </n-view-link>
        </n-view-link-next>
      </n-views>
    `)

    const link = page.body.querySelector(
      'n-view-link-next a',
    ) as HTMLAnchorElement
    expect(link).not.toBeUndefined()

    const input = page.body.querySelector(
      'n-view:first input',
    ) as HTMLInputElement
    expect(input).not.toBeUndefined()

    input.checkValidity = () => false

    link.click()

    await page.waitForChanges()

    expect(routingState.router!.location.pathname).toBe('/')

    page.root?.remove()
  })
})
