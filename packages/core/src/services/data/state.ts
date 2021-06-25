/* istanbul ignore file */

import { createStore } from '@stencil/store'
import { commonState } from '../common'
import { IDataProvider } from './interfaces'

class StateModel {
  enabled!: boolean
  providers!: Record<string, IDataProvider>
  providerTimeout!: number
}

const store = createStore<StateModel>({
  enabled: false,
  providers: {},
  providerTimeout: 1,
})

const { state, onChange, reset, dispose } = store

onChange('enabled', enabled => {
  commonState.dataEnabled = enabled
})

export {
  store as dataStore,
  state as dataState,
  onChange as onDataChange,
  reset as dataStateReset,
  dispose as dataStateDispose,
}
