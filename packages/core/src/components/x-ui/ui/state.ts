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
  store as uiStore,
  state as uiState,
  onChange as onUIChange,
  reset as uiStateReset,
  dispose as uiStateDispose,
}
