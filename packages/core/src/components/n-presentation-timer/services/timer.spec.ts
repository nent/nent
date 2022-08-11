jest.mock('../../../services/data/evaluate.worker')

import { TIMER_EVENTS } from '../../n-presentation/services/interfaces'
import { MockRequestAnimationFrameProvider } from './mocks/frame-provider'
import { FrameTimer } from './timer'

describe('frame-timer', () => {
  let subject: FrameTimer

  beforeEach(() => {})

  it('emits time, calculates currentTime, and ends on time.', async () => {
    const intervals: Array<number> = []
    let ended = false
    const animationFrameProvider =
      new MockRequestAnimationFrameProvider()
    subject = new FrameTimer(animationFrameProvider, 0, 60, () => 0)
    subject.on(TIMER_EVENTS.OnInterval, (time: number) => {
      intervals.push(time)
    })
    subject.on(TIMER_EVENTS.OnEnd, () => {
      ended = true
    })
    subject.begin()

    animationFrameProvider.triggerNextAnimationFrame(1000)
    expect(subject.currentTime).toBeDefined()
    expect(subject.currentTime!.elapsedSeconds).toBe(1)

    animationFrameProvider.triggerNextAnimationFrame(2000)
    expect(subject.currentTime).toBeDefined()
    expect(subject.currentTime!.elapsedSeconds).toBe(2)
    expect(intervals.length).toBe(2)

    animationFrameProvider.triggerNextAnimationFrame(60001)
    expect(subject.currentTime!.elapsedSeconds).toBe(60)
    expect(subject.currentTime!.minutes).toBe(1)

    animationFrameProvider.triggerNextAnimationFrame(65000)
    expect(subject.currentTime!.elapsedSeconds).toBe(60)
    expect(subject.currentTime!.minutes).toBe(1)

    expect(ended).toBeTruthy()
    animationFrameProvider.reset()
    subject.destroy()
  })
})
