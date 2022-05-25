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
import { NDetectRoute } from './n-detect-route'

describe('n-detect-route', () => {
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
      components: [NDetectRoute],
      html: `<n-detect-route></n-detect-route>`,
    })
    expect(page.root).toEqualHtml(`
      <n-detect-route>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </n-detect-route>
    `)
    page.root?.remove()
  })

  it('renders with view', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLink, NDetectRoute],
      html: `
      <n-views>
        <n-view-link path="/foo">Go to Foo</n-view-link>
        <n-view path="/foo">
        </n-view>
        <n-detect-route route="foo">
          <span slot="active">Yea!</span>
          <span>Nah!</span>
        </n-detect-route>
      </n-views>`,
    })

    const detectEl = page.root?.querySelector('n-detect-route')
    let detectSlot = detectEl?.shadowRoot?.querySelector('slot')
    expect(detectSlot?.getAttribute('name')).toBe(null)

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
