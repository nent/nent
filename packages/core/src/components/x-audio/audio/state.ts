/* istanbul ignore file */

import { createStore } from '@stencil/store'

class StateModel {
  hasAudioComponent!: boolean
  hasAudio!: boolean
  enabled!: boolean
  muted!: boolean
  debug!: boolean
}

const store = createStore<StateModel>({
  hasAudioComponent: false,
  hasAudio: false,
  enabled: true,
  muted: false,
  debug: false,
})

const { state, onChange, dispose, reset } = store

export {
  store as audioStore,
  state as audioState,
  onChange as onAudioStateChange,
  dispose as audioStateDispose,
  reset as audioStateReset,
}
