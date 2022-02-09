import { debounce, findAsyncSequential, sleep } from './promises'

describe('promise_utils.sleep', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  it('0', () => {
    sleep(100)
  })

  it('1', () => {
    sleep(1)
  })

  it('2', () => {
    sleep(0)
  })

  it('3', () => {
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

describe('misc_utils.debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.runOnlyPendingTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('executes correctly', async () => {
    let result = false
    const func = () => {
      result = true
    }
    const subject = debounce(300, func, true)
    subject()
    jest.advanceTimersByTime(300)

    expect(result)
  })

  it('executes only once given many sequential executions', () => {
    const results: boolean[] = []
    const subject = debounce(
      1000,
      () => {
        results.push(true)
      },
      false,
    )
    subject()
    subject()
    subject()
    subject()

    expect(results.length).toBe(1)
  })
})
