/* istanbul ignore file */

import { IEventEmitter } from '../common/interfaces'
export interface IEventActionListener {
  initialize(
    win: Window,
    actions: IEventEmitter,
    events: IEventEmitter,
  ): void
  destroy(): void
}

export enum ActionActivationStrategy {
  OnRender = 'on-render',
  OnEnter = 'on-enter',
  OnExit = 'on-exit',
  AtTime = 'at-time',
  AtTimeEnd = 'at-time-end',
  OnElementEvent = 'on-element-event',
  /** Future
   * OnScrolledIntoView
   * OnScrollDown
   * OnScrollUp
   * OnPageResize
   * OnNetworkDisconnect
   * OnNetworkReconnect
   * OnEvent (event bus)
   */
}

export interface EventAction<T> {
  topic: string
  command: string
  data: T
}

export const ACTIONS_DOM_EVENT = 'x:actions'
export const EVENTS_DOM_EVENT = 'x:events'

export interface IActionElement {
  command: string
  topic: string
  valid: boolean
  el: HTMLElement
  when?: string
  childScript: HTMLScriptElement | null
  childInputs: NodeListOf<Element>
  getAction(): Promise<EventAction<any> | null>
  sendAction(data?: any): Promise<void>
}
