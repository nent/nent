import { getTimeDetails } from './time'

describe('time', () => {
  it('getTimeDetails', () => {
    const time = getTimeDetails(1000, 2000, 2000)

    expect(time.duration).toBe(2000)
    expect(time.elapsed).toBe(1000)
    expect(time.seconds).toBe(1)
    expect(time.minutes).toBe(0)
    expect(time.hours).toBe(0)
    expect(time.percentage).toBe(0.5)
    expect(time.ended).toBeFalsy()
  })
})
