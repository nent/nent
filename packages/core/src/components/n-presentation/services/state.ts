/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  autoNext!: boolean
}

const store = createStore<StateModel>({
  autoNext: true,
})

const { state, onChange, reset, dispose } = store

export {
  store as presentationStore,
  state as presentationState,
  onChange as onPresentationChange,
  reset as presentationStateReset,
  dispose as presentationStateDispose,
}
