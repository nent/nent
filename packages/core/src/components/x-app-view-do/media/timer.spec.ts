jest.mock('../../../services/data/evaluate.worker')

import { TIMER_EVENTS } from './interfaces'
import { MockRequestAnimationFrameProvider } from './mocks/frame-provider'
import { ElementTimer } from './timer'

describe('element-timer:', () => {
  let subject: ElementTimer
  const animationFrameProvider = new MockRequestAnimationFrameProvider()

  beforeEach(() => {
    animationFrameProvider.reset()
  })

  it('emits time, calculates currentTime, and ends on time.', async () => {
    const intervals = []
    let ended = false
    subject = new ElementTimer(animationFrameProvider, 60, 0)
    subject.on(TIMER_EVENTS.OnInterval, time => {
      intervals.push(time)
    })
    subject.on(TIMER_EVENTS.OnEnd, () => {
      ended = true
    })
    subject.begin()

    animationFrameProvider.triggerNextAnimationFrame(1000)
    expect(subject.currentTime).toBeDefined()
    expect(subject.currentTime!.seconds).toBe(1)

    animationFrameProvider.triggerNextAnimationFrame(2000)
    expect(subject.currentTime).toBeDefined()
    expect(subject.currentTime!.seconds).toBe(2)
    expect(intervals.length).toBe(2)

    animationFrameProvider.triggerNextAnimationFrame(60000)
    expect(subject.currentTime!.minutes).toBe(1)
    expect(subject.currentTime!.elapsed).toBe(60)

    animationFrameProvider.triggerNextAnimationFrame(65000)
    expect(subject.currentTime!.minutes).toBe(1)
    expect(subject.currentTime!.elapsed).toBe(60)

    expect(ended).toBeTruthy()
  })
})
