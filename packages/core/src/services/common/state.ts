/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  debug!: boolean
  dataEnabled!: boolean
  elementsEnabled!: boolean
}

const store = createStore<StateModel>({
  debug: false,
  dataEnabled: false,
  elementsEnabled: false,
})

const { state, onChange, reset, dispose } = store

export {
  store as commonStore,
  state as commonState,
  onChange as onCommonChange,
  reset as commonStateReset,
  dispose as commonStateDispose,
}
