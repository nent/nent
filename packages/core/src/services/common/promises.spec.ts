import { findAsyncSequential, sleep } from './promises'
// @ponicode
describe('promise_utils.sleep', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  test('0', () => {
    sleep(100)
  })

  test('1', () => {
    sleep(1)
  })

  test('2', () => {
    sleep(0)
  })

  test('3', () => {
    sleep(NaN)
  })
})

describe('findAsyncSequential', () => {
  const asyncFunc = (e: number) => {
    return new Promise<number>(resolve => {
      setTimeout(() => resolve(e), e * 100)
    })
  }
  it('should get the result', async () => {
    const arr = [1, 2, 3]
    const final: number[] = []

    const result = await findAsyncSequential(arr, async p => {
      const value: number = await asyncFunc(p)
      final.push(value)
      return value == 3
    })
    expect(result).toBe(3)

    expect(final).toStrictEqual(arr)
  })
})
