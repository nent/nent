import { EventEmitter } from '../common/emitter'
export * from './interfaces'
export { actionBus, eventBus }

const actionBus = new EventEmitter()
const eventBus = new EventEmitter()
