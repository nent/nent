/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  theme!: 'light' | 'dark' | string | null
}

const store = createStore<StateModel>({
  theme: null,
})

const { state, onChange, reset, dispose } = store

export {
  store as appStore,
  state as appState,
  onChange as onAppChange,
  reset as appStateReset,
  dispose as appStateDispose,
}
