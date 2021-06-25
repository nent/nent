/* istanbul ignore file */

import { createStore } from '@stencil/store'
import { IDataProvider } from './interfaces'

class StateModel {
  debug!: boolean
  providers!: Record<string, IDataProvider>
  providerTimeout!: number
}

const store = createStore<StateModel>({
  debug: false,
  providers: {},
  providerTimeout: 1,
})

const { state, onChange, reset, dispose } = store

export {
  store as dataStore,
  state as dataState,
  onChange as onDataChange,
  reset as dataStateReset,
  dispose as dataStateDispose,
}
