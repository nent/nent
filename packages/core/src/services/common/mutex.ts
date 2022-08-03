/* It's a mutex that allows you to dispatch a function that will be executed in order */
export class Mutex {
  private mutex = Promise.resolve()

  /**
   * "The mutex is a promise that resolves to a promise that resolves to a function that unlocks the
   * mutex."
   *
   * The mutex is a promise that resolves to a promise that resolves to a function that unlocks the
   * mutex
   * @returns A promise that resolves to a function that unlocks the mutex.
   */
  lock(): PromiseLike<() => void> {
    let begin: (unlock: () => void) => void = _unlock => {}

    this.mutex = this.mutex.then(() => {
      return new Promise(begin)
    })

    return new Promise(res => {
      begin = res
    })
  }

  /**
   * It takes a function as an argument, and returns a promise that resolves to the return value of
   * that function
   * @param {(() => T) | (() => PromiseLike<T>)} fn - (() => T) | (() => PromiseLike<T>)
   * @returns A promise that resolves to the result of the function passed in.
   */
  async dispatch<T>(
    fn: (() => T) | (() => PromiseLike<T>),
  ): Promise<T> {
    const unlock = await this.lock()
    try {
      return await Promise.resolve(fn())
    } finally {
      unlock()
    }
  }
}
