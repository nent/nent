/* istanbul ignore file */

import { createStore } from '@stencil/store'
import { RouterService } from '../routing/router'

class StateModel {
  storageProvider!: string
  storedVisits!: string[]
  sessionVisits!: string[]
  router?: RouterService | null
}

const store = createStore<StateModel>({
  storageProvider: 'storage',
  storedVisits: [],
  sessionVisits: [],
  router: null,
})

const { state, onChange, reset, dispose } = store

export {
  store as navigationStore,
  state as navigationState,
  onChange as onNavigationChange,
  reset as navigationStateReset,
  dispose as navigationStateDispose,
}
