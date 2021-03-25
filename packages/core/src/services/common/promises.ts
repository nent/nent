/**
 * Wait ('await') for a specified amount of time.
 * @param {number} ms time in milliseconds to wait
 * @return {Promise<void>}
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * A synchronous way to find an item in a array with
 * an asynchronous predicate
 *
 * @export
 * @template T
 * @param {T[]} array
 * @param {(t: T) => Promise<boolean>} predicate
 * @return {(Promise<T|undefined>)}
 */
export async function findAsyncSequential<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>,
): Promise<T | null> {
  for (const t of array) {
    if (await predicate(t)) {
      return t
    }
  }

  return null
}
