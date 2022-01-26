import { EventEmitter } from '../common/emitter'
export * from './elements'
export * from './interfaces'
export * from './service'
export { actionBus, eventBus }

const actionBus = new EventEmitter()
const eventBus = new EventEmitter()
