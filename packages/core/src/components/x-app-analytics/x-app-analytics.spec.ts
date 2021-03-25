jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus } from '../../services/actions'
import { XAppViewDo } from '../x-app-view-do/x-app-view-do'
import { XAppView } from '../x-app-view/x-app-view'
import { XApp } from '../x-app/x-app'
import {
  ANALYTICS_COMMANDS,
  ANALYTICS_TOPIC,
} from './analytics/interfaces'
import { XAppAnalytics } from './x-app-analytics'

describe('x-app-analytics', () => {
  afterEach(async () => {
    actionBus.removeAllListeners()
  })
  it('renders and subscribes to page views', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo, XAppAnalytics],
      url: 'http://test/',
      html: `<x-app>
        <x-app-view url='/start'>
          <x-app-view-do url="step-1">
            <a id='s1' x-next>NEXT</a>
          </x-app-view-do>
          <x-app-view-do url="step-2">
            <a id='b2' x-back>BACK</a>
            <a id='s2' x-next>NEXT</a>
          </x-app-view-do>
          done!
        </x-app-view>
        <x-app-analytics>
        </x-app-analytics>
      </x-app>`,
    })

    const analytics = page.body.querySelector(
      'x-app-analytics',
    ) as HTMLXAppAnalyticsElement

    const pageView = []
    //@ts-ignore
    analytics!.addEventListener(
      'page-view',
      (e: CustomEvent<string>) => {
        pageView.push(e.detail)
      },
    )

    const router = page.body.querySelector('x-app')?.router

    router?.goToRoute('/start')

    await page.waitForChanges()

    expect(router!.location.pathname).toBe('/start/step-1')

    expect(pageView.length).toBe(2)

    analytics.remove()

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('renders and subscribes to view-time', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo, XAppAnalytics],
      url: 'http://test/',
      html: `<x-app>
        <x-app-analytics>
        </x-app-analytics>
      </x-app>`,
    })

    const analytics = page.body.querySelector(
      'x-app-analytics',
    ) as HTMLXAppAnalyticsElement

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

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })

  it('renders and subscribes to custom events', async () => {
    const page = await newSpecPage({
      components: [XApp, XAppView, XAppViewDo, XAppAnalytics],
      url: 'http://test/',
      html: `<x-app>
        <x-app-analytics>
        </x-app-analytics>
      </x-app>`,
    })

    const analytics = page.body.querySelector(
      'x-app-analytics',
    ) as HTMLXAppAnalyticsElement

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

    const subject = page.body.querySelector('x-app')
    subject?.remove()
  })
})
