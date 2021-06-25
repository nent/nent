/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  hasAudioComponent!: boolean
  muted!: boolean
  debug!: boolean
  tracksPlayed!: Array<string>
}

const store = createStore<StateModel>({
  hasAudioComponent: false,
  muted: false,
  debug: false,
  tracksPlayed: [],
})

const { state, onChange, dispose, reset } = store

export {
  store as audioStore,
  state as audioState,
  onChange as onAudioStateChange,
  dispose as audioStateDispose,
  reset as audioStateReset,
}
