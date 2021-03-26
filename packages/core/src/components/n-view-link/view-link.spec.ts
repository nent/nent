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
  navigationState,
  navigationStateDispose,
} from '../../services/navigation/state'
import { View } from '../n-view/view'
import { ViewRouter } from '../n-views/views'
import { ViewLink } from './view-link'

describe('n-view-link', () => {
  beforeEach(() => {
    commonState.actionsEnabled = true
    commonState.dataEnabled = true
  })
  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    commonStateDispose()
    dataStateDispose()
    navigationStateDispose()
  })
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewLink],
      html: `<n-view-link></n-view-link>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-link>
        <a class="link-active" n-attached-click="">
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
        <n-view-link href="/foo">Go to Foo</n-view-link>
        <n-view url="/foo">
        </n-view>
      </n-views>`,
    })

    let linkEl = page.body.querySelector('n-view-link')
    let anchor = page.body.querySelector('a')
    expect(anchor?.classList.contains('link-active')).toBe(false)

    anchor!.click()
    await page.waitForChanges()

    expect(navigationState.router!.location.pathname).toBe('/foo')

    expect(anchor?.classList.contains('link-active')).toBe(true)
    linkEl?.remove()

    page.root?.remove()
  })
})
