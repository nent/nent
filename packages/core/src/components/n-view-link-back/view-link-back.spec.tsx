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
import { clearVisits } from '../n-view/services/visits'
import { View } from '../n-view/view'
import {
  routingState,
  routingStateDispose,
} from '../n-views/services/state'
import { ViewRouter } from '../n-views/views'
import { ViewLinkBack } from './view-link-back'

describe('n-view-link-back', () => {
  beforeEach(() => {
    commonState.dataEnabled = true
  })
  afterEach(async () => {
    commonStateDispose()
    routingStateDispose()
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
    await clearVisits()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewLinkBack],
      html: `<n-view-link-back>Test</n-view-link-back>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-link-back>
        <n-view-link active-class="none" path="">
          Test
        </n-view-link>
      </n-view-link-back>
    `)
  })

  it('render back view link', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkBack, ViewLink],
      html: `<n-views start-path="/second">
              <n-view path='/first'>
              </n-view>
              <n-view path='/second'>
                <n-view-link-back text="Back">
                </n-view-link-back>
              </n-view>
            </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views start-path="/second" style="display:block;">
        <n-view path="/first">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view class="active exact" path="/second">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
          <n-view-link-back text="Back">
            <n-view-link active-class="none" >
              <a href="/first" n-attached-click="" n-attached-key-press="">
                Back
              </a>
            </n-view-link>
          </n-view-link-back>
        </n-view>
      </n-views>
    `)

    const link = page.body.querySelector(
      'n-view-link-back a',
    ) as HTMLAnchorElement
    expect(link).not.toBeUndefined()

    link!.click()

    await page.waitForChanges()

    expect(routingState.router!.location.pathname).toBe('/first')
    page.root!.remove()
  })

  it('render parent view link', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkBack],
      html: `<n-views >
        <n-view path='/parent'>
          <n-view path='/child'>
            <n-view-link-back>
              Back
            </n-view-link-back>
          </n-view>
        </n-view>
       </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views style="display:block;">
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
            <n-view-link-back>
              <n-view-link active-class="none" path="/parent">
                Back
              </n-view-link>
            </n-view-link-back>
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
        ViewLinkBack,
        ViewLink,
      ],
      html: `<n-views>
        <n-view path='/'>
          <n-view-prompt path='/child'>
            <n-view-link-back>
              <span></span>
            </n-view-link-back>
          </n-view-prompt>
        </n-view>
       </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views style="display:block;">
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
            <n-view-link-back>
              <n-view-link active-class="none">
                <a class="none" href="/" n-attached-click="" n-attached-key-press="">
                  <span></span>
                </a>
              </n-view-link>
            </n-view-link-back>
          </n-view-prompt>
        </n-view>
      </n-views>
    `)

    const link = page.body.querySelector(
      'n-view-link-back a',
    ) as HTMLAnchorElement
    expect(link).not.toBeUndefined()

    var event = new KeyboardEvent('keypress', { keyCode: 37 })
    link.dispatchEvent(event)

    expect(routingState.router?.location.pathname).toBe('/')

    page.root?.remove()
  })

  it('render back link from views', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLinkBack],
      html: `<n-views >
        <n-view path='/'>
        </n-view>
        <n-view path='/first'>
        </n-view>
        <n-view path='/second'>
        </n-view>
        <n-view-link-back>
          Back
        </n-view-link-back>
       </n-views>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views style="display:block;">
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
        <n-view-link-back>
          <n-view-link active-class="none" path="">
            Back
          </n-view-link>
        </n-view-link-back>
      </n-views>
    `)

    routingState.router?.goToRoute('/second')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-views style="display:block;">
        <n-view  class="active" path="/">
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
        <n-view class="active exact" path="/second">
          <mock:shadow-root>
            <slot></slot>
            <slot name="content"></slot>
          </mock:shadow-root>
        </n-view>
        <n-view-link-back>
          <n-view-link active-class="none" path="/first">
            Back
          </n-view-link>
        </n-view-link-back>
      </n-views>
    `)

    page.root?.remove()
  })
})
