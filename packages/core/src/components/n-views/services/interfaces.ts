/* istanbul ignore file */

import { ActionActivationStrategy } from '../../../services/actions'
import { LocationSegments } from '../../../services/common'
import { Path } from './utils'

export { LocationSegments }

export enum ROUTE_EVENTS {
  RouteChanged = 'route-changed',
  RouteMatched = 'route-matched',
  RouteMatchedExact = 'route-matched-exact',
  RouteFinalized = 'route-finalized',
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

export interface IRoute {
  path: string
  activateActions(
    AtTime: ActionActivationStrategy,
    filter: (activator: any) => boolean,
  ): Promise<void>
  goBack(): Promise<void>
  goNext(): Promise<void>
  goToRoute(path: string): void
  goToParentRoute(): void
}

export type RouteInfo = {
  match: MatchResults | null
  path: string
  routeElement: HTMLElement
  pageTitle: string
}

export enum NAVIGATION_COMMANDS {
  goNext = 'go-next',
  goTo = 'go-to',
  goBack = 'go-back',
}

export type NavigateTo = {
  path: string
}

export const NAVIGATION_TOPIC = 'navigation'

export type NavigateNext = Record<string, unknown>

export enum VisitStrategy {
  once = 'once',
  always = 'always',
  optional = 'optional',
}

export interface IViewPrompt {
  visit?: VisitStrategy | string
  when?: string
  visited?: boolean
  path: string
  [key: string]: any
}
