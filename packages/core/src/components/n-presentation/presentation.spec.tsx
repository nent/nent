jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
jest.mock('../n-presentation-timer/services/timer')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { commonStateDispose } from '../../services/common'
import { PresentationTimer } from '../n-presentation-timer/presentation-timer'
import { View } from '../n-view/view'
import { routingState } from '../n-views/services/state'
import { ViewRouter } from '../n-views/views'
import { Presentation } from './presentation'

describe('n-presentation', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    commonStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [Presentation],
      html: `<n-presentation></n-presentation>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation>
      </n-presentation>
    `)
  })

  it('renders in route, active', async () => {
    const page = await newSpecPage({
      components: [Presentation, View, ViewRouter, PresentationTimer],
      html: `<n-views>
              <n-view path="/">
                <n-presentation>
                  <n-presentation-timer duration="1">
                  </n-presentation-timer>
                </n-presentation>
              </n-view>
            </n-views>`,
    })
    expect(page.root).toEqualHtml(`
    <n-views  style="display: block;">
      <n-view path="/" class="active exact">
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <n-presentation>
          <n-presentation-timer duration="1">
          </n-presentation-timer>
        </n-presentation>
      </n-view>
    </n-views>
    `)
    page.root?.remove()
  })

  it('renders in route, inactive', async () => {
    const page = await newSpecPage({
      components: [Presentation, View, ViewRouter, PresentationTimer],
      html: `<n-views>
              <n-view path="/home">
                <n-presentation>
                  <n-presentation-timer duration="1">
                  </n-presentation-timer>
                </n-presentation>
              </n-view>
            </n-views>`,
    })
    const timer = page.root?.querySelector('n-presentation-timer')
    const spy = jest.spyOn(timer!.timer, 'begin')

    expect(page.root).toEqualHtml(`
    <n-views  style="display: block;">
      <n-view path="/home" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <n-presentation>
          <n-presentation-timer duration="1">
          </n-presentation-timer>
        </n-presentation>
      </n-view>
    </n-views>
    `)

    routingState.router?.goToRoute('/home')

    await page.waitForChanges()

    expect(spy).toBeCalled()

    expect(page.root).toEqualHtml(`
    <n-views  style="display: block;">
      <n-view path="/home" class="active exact" >
        <mock:shadow-root>
          <slot></slot>
          <slot name="content"></slot>
        </mock:shadow-root>
        <n-presentation>
          <n-presentation-timer duration="1">
          </n-presentation-timer>
        </n-presentation>
      </n-view>
    </n-views>
    `)
    page.root?.remove()
  })
})
