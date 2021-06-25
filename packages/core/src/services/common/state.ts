/* istanbul ignore file */

import { createStore } from '@stencil/store'

export class CommonStateModel {
  debug!: boolean
  analyticsEnabled!: boolean
  dataEnabled!: boolean
  elementsEnabled!: boolean
  routingEnabled!: boolean
  audioEnabled!: boolean
}

const store = createStore<CommonStateModel>({
  debug: false,
  analyticsEnabled: false,
  dataEnabled: false,
  elementsEnabled: false,
  routingEnabled: false,
  audioEnabled: true,
})

const { state, onChange, reset, dispose } = store

export {
  store as commonStore,
  state as commonState,
  onChange as onCommonStateChange,
  reset as commonStateReset,
  dispose as commonStateDispose,
}
