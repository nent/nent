/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  autoplay!: boolean
}

const store = createStore<StateModel>({
  autoplay: true,
})

const { state, onChange, reset, dispose } = store

export {
  store as videoStore,
  state as videoState,
  onChange as onVideoChange,
  reset as videoStateReset,
  dispose as videoStateDispose,
}
