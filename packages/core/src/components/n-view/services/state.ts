/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  storageProvider!: string
  storedVisits!: string[]
  sessionVisits!: string[]
}

const store = createStore<StateModel>({
  storageProvider: 'storage',
  storedVisits: [],
  sessionVisits: [],
})

const { state, onChange, reset, dispose } = store

export {
  store as navigationStore,
  state as navigationState,
  onChange as onNavigationChange,
  reset as navigationStateReset,
  dispose as navigationStateDispose,
}
