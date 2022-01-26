import { ActionActivationStrategy } from '../../../services/actions/interfaces'
import { MatchResults } from '../../n-views/services/interfaces'
import { Route } from './route'

export interface IView {
  route: Route
}

export interface IRoute {
  path: string
  activateActions(
    AtTime: ActionActivationStrategy,
    filter: (activator: any) => boolean,
  ): Promise<void>
  goBack(): void
  goNext(): void
  goToRoute(path: string): void
  goToParentRoute(): void
}

export type RouteInfo = {
  match: MatchResults | null
  path: string
  routeElement: HTMLElement
  pageTitle: string
  pageDescription: string
  pageKeywords: string
}

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
