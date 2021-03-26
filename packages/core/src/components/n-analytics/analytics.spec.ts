jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { commonStateDispose } from '../../services/common'
import {
  navigationState,
  navigationStateDispose,
} from '../../services/navigation/state'
import { ViewPrompt } from '../n-view-prompt/view-prompt'
import { View } from '../n-view/view'
import { ViewRouter } from '../n-views/views'
import { Analytics } from './analytics'
import {
  ANALYTICS_COMMANDS,
  ANALYTICS_TOPIC,
} from './analytics/interfaces'

describe('n-analytics', () => {
  afterEach(async () => {
    commonStateDispose()
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    navigationStateDispose()
  })
  it('renders and subscribes to page views', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt, Analytics],
      url: 'http://test/',
      html: `<n-views>
        <n-view url='/start'>
          <n-view-prompt url="step-1">
            <a id='s1' n-next>NEXT</a>
          </n-view-prompt>
          <n-view-prompt url="step-2">
            <a id='b2' n-back>BACK</a>
            <a id='s2' n-next>NEXT</a>
          </n-view-prompt>
          done!
        </n-view>
        <n-analytics>
        </n-analytics>
      </n-views>`,
    })

    const analytics = page.body.querySelector(
      'n-analytics',
    ) as HTMLAnalyticsElement

    const pageView = []
    //@ts-ignore
    analytics!.addEventListener(
      'page-view',
      (e: CustomEvent<string>) => {
        pageView.push(e.detail)
      },
    )

    const router = navigationState?.router

    router?.goToRoute('/start')

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    expect(pageView.length).toBe(2)

    analytics.remove()

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })

  it('renders and subscribes to view-time', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt, Analytics],
      url: 'http://test/',
      html: `<n-views>
        <n-analytics>
        </n-analytics>
      </n-views>`,
    })

    const analytics = page.body.querySelector(
      'n-analytics',
    ) as HTMLAnalyticsElement

    const viewTimes = []
    //@ts-ignore
    analytics!.addEventListener(
      'view-time',
      (e: CustomEvent<string>) => {
        viewTimes.push(e.detail)
      },
    )

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendViewTime,
      data: {
        id: 'video-1',
        time: '15%',
      },
    })

    await page.waitForChanges()

    expect(viewTimes.length).toBe(1)

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendViewTime,
      data: {
        id: 'video-1',
        time: '25%',
      },
    })

    expect(viewTimes.length).toBe(2)
    analytics.remove()

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })

  it('renders and subscribes to custom events', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, View, ViewPrompt, Analytics],
      url: 'http://test/',
      html: `<n-views>
        <n-analytics>
        </n-analytics>
      </n-views>`,
    })

    const analytics = page.body.querySelector(
      'n-analytics',
    ) as HTMLNAnalyticsElement

    const events: any[] = []
    //@ts-ignore
    analytics!.addEventListener('event', (e: CustomEvent<string>) => {
      events.push(e.detail)
    })

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendEvent,
      data: {
        id: 'video-1',
        rating: 'is HOT!',
      },
    })

    await page.waitForChanges()

    expect(events.length).toBe(1)

    actionBus.emit(ANALYTICS_TOPIC, {
      topic: ANALYTICS_TOPIC,
      command: ANALYTICS_COMMANDS.SendEvent,
      data: {
        id: 'video-2',
        rating: 'sucks!',
      },
    })

    expect(events.length).toBe(2)

    expect(events[0].rating).toBe('is HOT!')
    analytics.remove()

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })
})
