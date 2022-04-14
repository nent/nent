/* istanbul ignore file */

import { LocationSegments } from '../../../services/common'
import { Path } from './utils'

export { LocationSegments }

export enum ROUTE_EVENTS {
  RouteChangeStart = 'route-change-start',
  RouteChanged = 'route-changed',
  RouteMatched = 'route-matched',
  RouteMatchedExact = 'route-matched-exact',
  RouteChangeFinish = 'route-change-finish',
  Initialized = 'initialized',
}

export interface RouteViewOptions {
  scrollTopOffset?: number
  scrollToId?: string
}

export type LocationSegmentPart =
  | 'pathname'
  | 'search'
  | 'hash'
  | 'state'
  | 'key'

export interface RouterHistory {
  length: number
  action: string
  location: LocationSegments
  createHref: (location: LocationSegments) => string
  push: (path: string, state?: any) => void
  replace: (path: string, state?: any) => void
  go: (n: number) => void
  goBack: () => void
  goForward: () => void
  block: any
  listen: (listener: any) => () => void
  win: Window
}

export interface MatchOptions {
  path?: Path
  exact?: boolean
  strict?: boolean
}

export interface MatchResults {
  path: Path
  url: string
  isExact: boolean
  params: Record<string, string>
}

export enum NAVIGATION_COMMANDS {
  goNext = 'go-next',
  goTo = 'go-to',
  goBack = 'go-back',
  goToParent = 'go-to-parent',
  back = 'back',

}

export type NavigateTo = {
  path: string
}

export const NAVIGATION_TOPIC = 'navigation'

export type NavigateNext = Record<string, unknown>
