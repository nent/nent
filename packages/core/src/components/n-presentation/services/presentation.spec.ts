jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../../services/common'
import { contentStateDispose } from '../../../services/content/state'
import { ActionActivator } from '../../n-action-activator/action-activator'
import { Action } from '../../n-action/action'
import { ElementsActionListener } from '../../n-elements/services/actions'
import { MockRequestAnimationFrameProvider } from '../../n-presentation-timer/services/mocks/frame-provider'
import { MockRoute } from '../../n-presentation-timer/services/mocks/route'
import { FrameTimer } from '../../n-presentation-timer/services/timer'
import { Video } from '../../n-video/video'
import { TIMER_EVENTS } from './interfaces'
import { PresentationService } from './presentation'

describe('presentation', () => {
  let subject: PresentationService
  let timer: FrameTimer
  const animationFrameProvider = new MockRequestAnimationFrameProvider()

  beforeEach(async () => {
    animationFrameProvider.reset()
    commonState.elementsEnabled = true
  })

  afterEach(async () => {
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    subject?.cleanup()
    contentStateDispose()
    commonStateDispose()
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

    timer = new FrameTimer(animationFrameProvider, 60, 0)

    subject = new PresentationService(
      page.body,
      timer,
      new MockRoute(),
      false,
    )

    await subject.beginTimer()

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
      components: [Video],
      html: `
      <div>
        <n-video><video id="video"></video></n-video>
        <input n-time-to="value"/>
      </div>
      `,
    })

    await page.waitForChanges()

    const xVideo = page.body.querySelector(
      'n-video',
    ) as HTMLNVideoElement

    expect(xVideo?.timer).not.toBeNull()

    subject = new PresentationService(
      page.body,
      xVideo!.timer!,
      new MockRoute(),
      false,
    )
    await subject.beginTimer()

    xVideo.timer?.emit(TIMER_EVENTS.OnInterval, {
      elapsed: 1,
    })

    const input = page.body.querySelector('input')!
    expect(input.value).toBe('1')
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
    timer = new FrameTimer(animationFrameProvider, 60, 0)

    subject = new PresentationService(
      page.body,
      timer,
      new MockRoute(),
    )

    await subject.beginTimer()
    animationFrameProvider.triggerNextAnimationFrame(60000)
    let p = page.body.querySelector('p')
    expect(p?.innerText).toBe('100%')
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
    timer = new FrameTimer(animationFrameProvider, 0, 0)

    const route = new MockRoute()

    const goNext = jest
      .spyOn(route, 'goNext')
      .mockImplementationOnce(() => {})

    subject = new PresentationService(
      page.body,
      timer,
      route,
      false,
      true,
    )

    await subject.beginTimer()

    timer.emit(TIMER_EVENTS.OnEnd)

    await page.waitForChanges()

    expect(goNext).toBeCalled()
  })

  it('captures n-time-in,n-in-class, n-time-out, n-out-class', async () => {
    // const listener = new ElementsActionListener()
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
      autoApplyChanges: true,
    })

    timer = new FrameTimer(animationFrameProvider, 10, 0)

    // listener.initialize(page.win, actionBus, eventBus)

    subject = new PresentationService(
      page.body,
      timer,
      new MockRoute(),
      true,
      false,
    )
    await subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(1500)

    expect(timer.currentTime?.elapsed).toBe(1.5)

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

    expect(page.root).toEqualHtml(`<div hidden
        n-in-time="1"
        n-in-class="fade-in"
        n-out-time="3"
        n-out-class="fade-out">
        Cool Thing
      </div>
      `)

    // listener.destroy()
  })

  it('processes timed actions', async () => {
    const listener = new ElementsActionListener()
    const page = await newSpecPage({
      components: [ActionActivator, Action],
      html: `<div>
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

    timer = new FrameTimer(animationFrameProvider, 10, 0)

    listener.initialize(page.win, actionBus, eventBus)

    subject = new PresentationService(
      page.body,
      timer,
      new MockRoute(),
    )
    await subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(1500)

    expect(timer.currentTime?.elapsed).toBe(1.5)

    await page.waitForChanges()

    expect(page.body.innerHTML).toEqualHtml(
      `<div>
        <p>Show me!</p>
        <n-action-activator activate="at-time" time="1">
          <!---->
          <n-action topic="elements" command="remove-attribute"
            data-selector="p"
            data-attribute="hidden">
          </n-action>
        </n-action-activator>
       </div>
      `,
    )

    listener.destroy()
  })
})
