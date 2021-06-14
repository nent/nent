/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  darkMode!: boolean | null
}

const store = createStore<StateModel>({
  darkMode: null,
})

const { state, onChange, reset, dispose } = store

export {
  store as appStore,
  state as appState,
  onChange as onAppChange,
  reset as appStateReset,
  dispose as appStateDispose,
}
