jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { dataStateDispose } from '../../services/data/state'
import { View } from '../n-view/view'
import {
  routingState,
  routingStateDispose,
} from '../n-views/services/state'
import { ViewRouter } from '../n-views/views'
import { ViewLink } from './view-link'

describe('n-view-link', () => {
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
      components: [ViewLink],
      html: `<n-view-link></n-view-link>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-link>
        <a class="active" n-attached-click="">
        </a>
      </n-view-link>
    `)
    let anchor = page.body.querySelector('a')
    anchor!.click()
    page.root?.remove()
  })

  it('renders with view', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewLink],
      html: `
      <n-views>
        <n-view-link path="/foo">Go to Foo</n-view-link>
        <n-view path="/foo">
        </n-view>
      </n-views>`,
    })

    let linkEl = page.body.querySelector('n-view-link')
    let anchor = page.body.querySelector('a')
    expect(anchor?.classList.contains('active')).toBe(false)

    anchor!.click()
    await page.waitForChanges()

    expect(routingState?.router!.location.pathname).toBe('/foo')

    expect(anchor?.classList.contains('active')).toBe(true)
    linkEl?.remove()

    page.root?.remove()
  })
})
