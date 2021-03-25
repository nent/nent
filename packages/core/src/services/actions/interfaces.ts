import { IEventEmitter } from '../common/interfaces'
/* istanbul ignore file */

export interface IEventActionListener {
  initialize(
    win: Window,
    actions: IEventEmitter,
    events: IEventEmitter,
  ): void
  destroy(): void
}

export enum ActionActivationStrategy {
  OnEnter = 'on-enter',
  OnExit = 'on-exit',
  AtTime = 'at-time',
  OnElementEvent = 'on-element-event',
}

export interface EventAction<T> {
  topic: string
  command: string
  data: T
}

export const ACTIONS_DOM_EVENT = 'x:actions'
export const EVENTS_DOM_EVENT = 'x:events'

export interface IActionElement {
  command: any
  topic: any
  getAction(): Promise<EventAction<any> | null>
  sendAction(data?: any): Promise<void>
}
