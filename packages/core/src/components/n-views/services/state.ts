/* istanbul ignore file */

import { createStore } from '@stencil/store'
import { Route } from '../../n-view/services/route'
import { LocationSegments } from './interfaces'
import { RouterService } from './router'

class StateModel {
  router!: RouterService | null
  location!: LocationSegments | null
  exactRoute!: Route | null
}

const store = createStore<StateModel>({
  router: null,
  location: null,
  exactRoute: null,
})

const { state, onChange, reset, dispose } = store
let subscribed = false
onChange('router', router => {
  if (router && subscribed == false) {
    router.eventBus.on('*', () => {
      state.location = router.location
      state.exactRoute = router.exactRoute
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
