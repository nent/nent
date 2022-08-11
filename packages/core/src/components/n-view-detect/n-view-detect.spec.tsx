jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { dataStateDispose } from '../../services/data/state'
import {
  routingState,
  routingStateDispose,
} from '../n-views/services/state'
import { View } from '../n-view/view'
import { ViewRouter } from '../n-views/views'
import { ViewLink } from '../n-view-link/view-link'
import { ViewDetect } from './view-detect'

describe('n-view-detect', () => {
  beforeEach(() => {
    commonState.dataEnabled = true
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    commonStateDispose()
    dataStateDispose()
    routingStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewDetect],
      html: `<n-view-detect></n-view-detect>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-detect>
        <mock:shadow-root>
          <slot name="inactive"></slot>
        </mock:shadow-root>
      </n-view-detect>
    `)
    page.root?.remove()
  })

  it('renders with view', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLink, ViewDetect],
      html: `
      <n-views>
        <n-view-link path="/foo">Go to Foo</n-view-link>
        <n-view path="/foo">
        </n-view>
        <n-view-detect route="foo">
          <span slot="active">Yea!</span>
          <span slot="inactive">Nah!</span>
        </n-view-detect>
      </n-views>`,
    })

    const detectEl = page.root?.querySelector('n-view-detect')
    let detectSlot = detectEl?.shadowRoot?.querySelector('slot')
    expect(detectSlot?.getAttribute('name')).toBe('inactive')

    const linkEl = page.body.querySelector('n-view-link')
    const anchor = page.body.querySelector('a')
    expect(anchor?.classList.contains('active')).toBe(false)

    anchor!.click()
    await page.waitForChanges()

    expect(routingState?.router!.location.pathname).toBe('/foo')

    await page.waitForChanges()

    detectSlot = detectEl?.shadowRoot?.querySelector('slot')
    expect(detectSlot?.getAttribute('name')).toBe('active')

    expect(anchor?.classList.contains('active')).toBe(true)
    linkEl?.remove()

    page.root?.remove()
  })
})
