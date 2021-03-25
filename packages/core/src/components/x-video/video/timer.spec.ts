import { newSpecPage } from '@stencil/core/testing'
import {
  TimeDetails,
  TIMER_EVENTS,
} from '../../x-app-view-do/media/interfaces'
import { VideoTimer } from './timer'

describe('element-timer:', () => {
  let subject: VideoTimer

  beforeEach(() => {})

  it('emits time, calculates currentTime, and ends on time.', async () => {
    const page = await newSpecPage({
      components: [],
      html: `<video></video>`,
    })
    const source = page.root as any

    subject = new VideoTimer(page.root)

    const intervals: TimeDetails[] = []
    let ended = false

    subject.on(TIMER_EVENTS.OnInterval, (time: TimeDetails) => {
      intervals.push(time)
    })

    subject.on(TIMER_EVENTS.OnEnd, () => {
      ended = true
    })

    subject.begin()

    source.currentTime = 1
    source.dispatchEvent(new CustomEvent('timeupdate'))
    await page.waitForChanges()

    expect(subject.currentTime).toBeDefined()
    expect(subject.currentTime.seconds).toBe(1)

    source.currentTime = 2
    source.dispatchEvent(new CustomEvent('timeupdate'))
    await page.waitForChanges()

    expect(subject.currentTime).toBeDefined()
    expect(subject.currentTime.seconds).toBe(2)
    expect(intervals.length).toBe(2)

    source.currentTime = 60
    source.dispatchEvent(new CustomEvent('timeupdate'))
    await page.waitForChanges()

    expect(subject.currentTime.minutes).toBe(1)
    expect(subject.currentTime.elapsed).toBe(60)
    expect(subject.currentTime!.minutes).toBe(1)
    expect(subject.currentTime!.elapsed).toBe(60)

    source.dispatchEvent(new CustomEvent('ended'))

    await page.waitForChanges()

    expect(ended).toBeTruthy()

    subject.destroy()
  })
})
