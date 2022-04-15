/* istanbul ignore file */

import { createStore } from '@stencil/store'
import { LocationSegments } from './interfaces'
import { RouterService } from './router'

export class RoutingStateModel {
  router!: RouterService | null
  location!: LocationSegments | null
  hasExactRoute: boolean = false
  debug: boolean = false
}

const store = createStore<RoutingStateModel>({
  router: null,
  location: null,
  hasExactRoute: false,
  debug: false,
})

const { state, onChange, reset, dispose } = store
let subscribed = false
onChange('router', router => {
  if (router && subscribed == false) {
    router.eventBus.on('*', () => {
      state.hasExactRoute = false
      state.location = router.location
      state.hasExactRoute = router.hasExactRoute()
    })
    subscribed = true
  }
})

export {
  state as routingState,
  onChange as onRoutingChange,
  reset as routingStateReset,
  dispose as routingStateDispose,
}
