import { Mutex } from '../common/mutex'
import { contentState } from './state'

const collectionMutex = new Mutex()

/**
 * It returns true if the given url is in the list of references
 * @param {string} url - The URL of the reference to check for.
 * @returns A boolean value.
 */
export async function hasReference(url: string) {
  return await collectionMutex.dispatch(async () => {
    return contentState.references.includes(url)
  })
}

/**
 * Atomically checks if a URL is already referenced and, if not, marks it.
 * Returns true if the reference already existed (skip loading), false if
 * newly added (proceed to load). Using a single mutex dispatch prevents
 * the check-then-act race condition when multiple components render
 * concurrently.
 * @param {string} url - The URL to check and mark.
 */
export async function checkAndMarkReference(url: string): Promise<boolean> {
  return await collectionMutex.dispatch(async () => {
    if (contentState.references.includes(url)) {
      return true
    }
    contentState.references = [
      ...new Set([...contentState.references, url]),
    ]
    return false
  })
}

/**
 * It takes a URL, adds it to the list of references, and returns a promise that resolves when the
 * operation is complete
 * @param {string} url - The URL of the reference to mark.
 * @returns A promise that resolves to the result of the function passed to dispatch.
 */
export async function markReference(url: string) {
  return await collectionMutex.dispatch(async () => {
    contentState.references = [
      ...new Set([...contentState.references, url]),
    ]
  })
}

/**
 * It clears the references to the objects in the `references` array.
 */
export async function clearReferences() {
  return await collectionMutex.dispatch(async () => {
    contentState.references = []
  })
}
