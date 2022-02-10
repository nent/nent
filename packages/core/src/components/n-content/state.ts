/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  references!: string[]
  cache!: Record<string, string>
}

const store = createStore<StateModel>({
  references: [],
  cache: {},
})

const { state, onChange, reset, dispose } = store

export {
  store as contentStore,
  state as contentState,
  onChange as onContentChange,
  reset as contentStateReset,
  dispose as contentStateDispose,
}
