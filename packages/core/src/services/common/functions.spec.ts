import { debounce } from './functions'

describe('misc_utils.debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.runOnlyPendingTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('executes correctly', async () => {
    let result = false
    const func = () => {
      result = true
    }
    const subject = debounce(300, func, true)
    subject()
    jest.advanceTimersByTime(300)

    expect(result)
  })

  test('executes only once given many sequential executions', () => {
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
