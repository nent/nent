import { Mutex } from '../../../services/common/mutex'
import { contentState } from '../../n-content/state'

const collectionMutex = new Mutex()

export async function hasReference(url: string) {
  return await collectionMutex.dispatch(async () => {
    return contentState.references.includes(url)
  })
}

export async function markReference(url: string) {
  return await collectionMutex.dispatch(async () => {
    contentState.references = [
      ...new Set([...contentState.references, url]),
    ]
  })
}

export async function clearReferences() {
  return await collectionMutex.dispatch(async () => {
    contentState.references = []
  })
}
