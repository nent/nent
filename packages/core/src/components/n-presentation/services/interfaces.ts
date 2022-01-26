import { IEventEmitter } from '../../../services/common'

export enum TIMER_EVENTS {
  OnInterval = 'on-interval',
  OnEnd = 'on-end',
}

export type TimedNode = {
  start: number
  end: number
  classIn: string | null
  classOut: string | null
  element: {
    id: any
    classList: {
      contains: (arg0: string) => any
      add: (arg0: string) => void
      remove: (arg0: string) => void
    }
    hasAttribute: (arg0: string) => any
    removeAttribute: (arg0: string) => void
    setAttribute: (arg0: string, arg1: string) => void
  }
}

export interface TimeDetails {
  hours: number
  minutes: number
  seconds: number
  elapsed: number
  percentage: number
  duration: number
  ended: boolean
}

export interface ITimer extends IEventEmitter {
  currentTime: TimeDetails
  duration: number
  begin(): void
  stop(): void
  destroy(): void
}

export interface IElementTimer {
  [key: string]: any
  timer: ITimer
}
