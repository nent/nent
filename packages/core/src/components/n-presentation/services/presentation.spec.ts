jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../../services/actions'
import { contentStateDispose } from '../../../services/content/state'
import { ActionActivator } from '../../n-action-activator/action-activator'
import { Action } from '../../n-action/action'
import { ElementsActionListener } from '../../n-elements/services/actions'
import { MockRequestAnimationFrameProvider } from '../../n-presentation-timer/services/mocks/frame-provider'
import { MockRoute } from '../../n-presentation-timer/services/mocks/route'
import { FrameTimer } from '../../n-presentation-timer/services/timer'
import { NVideo } from '../../n-video/video'
import { Presentation } from '../presentation'
import { TIMER_EVENTS } from './interfaces'
import { PresentationService } from './presentation'

describe('presentation-service', () => {
  let subject: PresentationService

  afterEach(() => {
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    subject?.cleanup()
    contentStateDispose()
  })

  it('initialized with element timer', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div id="timer">
        <input type="text" n-percentage-to="value" />
      </div>
      `,
    })
    const animationFrameProvider = new MockRequestAnimationFrameProvider()
    const timer = new FrameTimer(animationFrameProvider, 0, 60, 0)

    subject = new PresentationService(page.body, timer, true)

    subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(20000)

    await page.waitForChanges()
    let input = page.body.querySelector('input')
    expect(input!.value).toBe('0.33')

    animationFrameProvider.triggerNextAnimationFrame(60000)
    await page.waitForChanges()
    expect(input!.value).toBe('1.00')
  })

  it('initializes with video timer', async () => {
    const page = await newSpecPage({
      components: [NVideo],
      html: `
      <div>
        <n-video><video id="video" duration="10"></video></n-video>
        <input n-time-to="value"/>
      </div>
      `,
    })

    await page.waitForChanges()

    const video = page.body.querySelector('video')
    video?.dispatchEvent(new CustomEvent('ready'))

    const nVideo = page.body.querySelector(
      'n-video',
    ) as HTMLNVideoElement

    expect(nVideo?.timer).not.toBeUndefined()

    subject = new PresentationService(page.body, nVideo!.timer!, true)
    subject.beginTimer()

    nVideo.timer?.emit(TIMER_EVENTS.OnInterval, {
      elapsed: 1,
    })

    const input = page.body.querySelector('input')!
    expect(input.value).toBe('1')

    nVideo.remove()
  })

  it('emits time then cleans up', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div id="timer">
        <p n-percentage-to></p>
      </div>
      `,
    })
    const animationFrameProvider = new MockRequestAnimationFrameProvider()
    const timer = new FrameTimer(animationFrameProvider, 0, 60)

    subject = new PresentationService(page.body, timer, true)
    subject.beginTimer()
    animationFrameProvider.triggerNextAnimationFrame(10000)
    animationFrameProvider.triggerNextAnimationFrame(59000)

    await page.waitForChanges()
    let p = page.body.querySelector('p')
    expect(p!.innerText).toBe('98%')
  })

  it('next on end', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div>
        <input id=="name" required value="Walter" />
      </div>
      `,
    })
    const animationFrameProvider = new MockRequestAnimationFrameProvider()
    const timer = new FrameTimer(animationFrameProvider, 0, 0, 0)

    const route = new MockRoute()

    const goNext = jest
      .spyOn(route, 'goNext')
      .mockImplementationOnce(async () => {})

    subject = new PresentationService(
      page.body,
      timer,
      false,
      null,
      async () => {
        route.goNext()
      },
    )

    subject.beginTimer()

    timer.emit(TIMER_EVENTS.OnEnd)

    await page.waitForChanges()

    expect(goNext).toBeCalled()
  })

  it('captures n-time-in,n-in-class, n-time-out, n-out-class', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<div hidden
        n-in-time="1"
        n-in-class="fade-in"
        n-out-time="3"
        n-out-class="fade-out">
        Cool Thing
      </div>
      `,
    })

    const animationFrameProvider = new MockRequestAnimationFrameProvider()
    const timer = new FrameTimer(animationFrameProvider, 0, 10)

    subject = new PresentationService(page.body, timer, true)
    subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(1500)
    await page.waitForChanges()

    expect(page.root).toEqualHtml(
      `<div class="fade-in"
          n-in-time="1"
          n-in-class="fade-in"
          n-out-time="3"
          n-out-class="fade-out">
          Cool Thing
      </div>
      `,
    )

    animationFrameProvider.triggerNextAnimationFrame(3500)

    expect(page.root).toEqualHtml(
      `<div class="fade-out"
          n-in-time="1"
          n-in-class="fade-in"
          n-out-time="3"
          n-out-class="fade-out">
          Cool Thing
      </div>
      `,
    )

    animationFrameProvider.triggerNextAnimationFrame(10500)

    expect(page.root).toEqualHtml(`<div
        n-in-time="1"
        n-in-class="fade-in"
        n-out-time="3"
        n-out-class="fade-out">
        Cool Thing
      </div>
      `)
  })

  it('processes timed actions', async () => {
    const listener = new ElementsActionListener()
    const page = await newSpecPage({
      components: [Presentation, ActionActivator, Action],
      html: `<n-presentation>
              <p hidden>Show me!</p>
              <n-action-activator activate="at-time" time="1">
                <n-action topic="elements" command="remove-attribute"
                  data-selector="p"
                  data-attribute="hidden">
                </n-action>
              </n-action-activator>
            </div>
            `,
    })

    const animationFrameProvider = new MockRequestAnimationFrameProvider()
    const timer = new FrameTimer(animationFrameProvider, 0, 10, 0)

    listener.initialize(page.win, actionBus, eventBus)

    subject = new PresentationService(page.body, timer)
    subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(1500)

    expect(timer.currentTime?.elapsed).toBeGreaterThan(1)

    await page.waitForChanges()

    expect(page.body.innerHTML).toEqualHtml(
      `<n-presentation>
        <p>Show me!</p>
        <n-action-activator activate="at-time" time="1">
          <!---->
          <n-action topic="elements" command="remove-attribute"
            data-selector="p"
            data-attribute="hidden">
          </n-action>
        </n-action-activator>
       </n-presentation>
      `,
    )

    listener.destroy()
  })
})
