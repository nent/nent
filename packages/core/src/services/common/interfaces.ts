/* istanbul ignore file */

export type Listener = (...args: any[]) => void

export type IEvents = Record<string, Listener[]>

export interface LocationSegments {
  params: Record<string, any>
  pathname: string
  query: Record<string, any>
  key: string
  scrollPosition?: [number, number]
  search?: string
  hash?: string
  state?: any
  pathParts?: string[]
  hashParts?: string[]
}

export interface IEventEmitter {
  on(event: string, listener: Listener): () => void
  removeListener(event: string, listener: Listener): void
  removeAllListeners(): void
  emit(event: string, ...args: any[]): void
  once(event: string, listener: Listener): () => void
  destroy(): void
}

export type PageData = {
  title?: string
  description?: string
  keywords?: string
  robots?: string
}
