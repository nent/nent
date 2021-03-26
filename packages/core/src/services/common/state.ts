/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  debug!: boolean
  analyticsEnabled!: boolean
  dataEnabled!: boolean
  elementsEnabled!: boolean
  actionsEnabled!: boolean
  routingEnabled!: boolean
  audioEnabled!: boolean
}

const store = createStore<StateModel>({
  debug: false,
  analyticsEnabled: false,
  dataEnabled: false,
  elementsEnabled: false,
  actionsEnabled: true,
  routingEnabled: false,
  audioEnabled: false,
})

const { state, onChange, reset, dispose } = store

export {
  store as commonStore,
  state as commonState,
  onChange as onCommonStateChange,
  reset as commonStateReset,
  dispose as commonStateDispose,
}
