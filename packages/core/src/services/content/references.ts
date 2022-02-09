import { Mutex } from '../common/mutex'
import { contentState } from './state'

const collectionMutex = new Mutex()

export async function hasReference(url: string) {
  const unlock = await collectionMutex.lock()
  const result = contentState.references.includes(url)
  unlock()
  return result
}

export async function markReference(url: string) {
  return await collectionMutex.dispatch(async () => {
    contentState.references = [
      ...new Set([...contentState.references, url]),
    ]
  })
}

export async function clearReferences() {
  const unlock = await collectionMutex.lock()
  contentState.references = []
  unlock()
}
