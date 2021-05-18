/* istanbul ignore file */

import { createStore } from '@stencil/store'
import { RouterService } from './router'

class StateModel {
  router!: RouterService | null
}

const store = createStore<StateModel>({
  router: null,
})

const { state, onChange, reset, dispose } = store

export {
  store as routingStore,
  state as routingState,
  onChange as onRoutingChange,
  reset as routingStateReset,
  dispose as routingStateDispose,
}
