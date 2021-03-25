import { contentState } from './state'

export function hasReference(url: string) {
  return contentState.references.includes(url)
}

export function markReference(url: string) {
  contentState.references = [
    ...new Set([...contentState.references, url]),
  ]
}

export function clearReferences() {
  contentState.references = []
}
