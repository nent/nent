/* istanbul ignore file */

import { TimeDetails } from '../../n-presentation/services/interfaces'

export const ANALYTICS_TOPIC = 'analytics'

export enum ANALYTICS_COMMANDS {
  SendEvent = 'send-event',
  SendViewTime = 'send-view-time',
  SendPageView = 'send-page-view',
}

export enum ANALYTICS_EVENTS {
  ListenerRegistered = 'analytics:listener-registered',
}

export interface ViewTime {
  event: string
  time: TimeDetails
}
