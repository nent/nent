/* istanbul ignore file */

import { IEventEmitter } from '../common/interfaces'

export interface IDataMutator {
  set(key: string, value: string): Promise<void>
}

export interface IDataProvider {
  get(key: string): Promise<string | null>
  changed?: IEventEmitter | null
}

export interface IServiceProvider
  extends IDataProvider,
    IDataMutator {}

export type ExpressionContext = Record<string, any>

export const DATA_TOPIC = 'data'

export enum DATA_EVENTS {
  DataChanged = 'data-changed',
}
