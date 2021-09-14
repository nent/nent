import { EventAction } from '../../../services/actions/interfaces'
import { IEventEmitter } from '../../../services/common/interfaces'
import { debugIf, logIf } from '../../../services/common/logging'
import { commonState } from '../../../services/common/state'
import { Route } from '../../n-view/services/route'
import {
  LocationSegments,
  MatchResults,
  NavigateNext,
  NavigateTo,
  NAVIGATION_COMMANDS,
  NAVIGATION_TOPIC,
  ROUTE_EVENTS,
} from './interfaces'
import { RouterService } from './router'

export class NavigationActionListener {
  private readonly removeSubscription!: () => void

  constructor(
    private router: RouterService,
    private events: IEventEmitter,
    private actions: IEventEmitter,
  ) {
    this.removeSubscription = this.actions.on(NAVIGATION_TOPIC, e => {
      this.handleEventAction(e)
    })
  }

  notifyRouterInitialized() {
    logIf(commonState.debug, `route event: initialized`)
    this.events.emit(ROUTE_EVENTS.Initialized, {})
  }

  notifyRouteChangeStarted(newPath: string) {
    logIf(commonState.debug, `route event: started ${newPath}`)
    this.events.emit(ROUTE_EVENTS.RouteChangeStart, newPath)
  }

  notifyRouteChanged(location: LocationSegments) {
    logIf(commonState.debug, `route event: changed`)
    this.events.emit(ROUTE_EVENTS.RouteChanged, location)
  }

  notifyRouteFinalized(location: LocationSegments) {
    logIf(commonState.debug, `route event: finalized`)
    this.events.emit(ROUTE_EVENTS.RouteChangeFinish, location)
  }

  notifyMatch(route: Route, match: MatchResults) {
    logIf(commonState.debug, `route event: matched`)
    this.events.emit(ROUTE_EVENTS.RouteMatched, {
      route,
      match,
    })
  }

  notifyMatchExact(route: Route, match: MatchResults) {
    logIf(commonState.debug, `route event: matched-exact`)
    this.events.emit(ROUTE_EVENTS.RouteMatchedExact, {
      route,
      match,
    })
  }

  handleEventAction(
    eventAction: EventAction<NavigateTo | NavigateNext>,
  ) {
    debugIf(
      commonState.debug,
      `route-listener: action received ${JSON.stringify(
        eventAction,
      )}`,
    )

    switch (eventAction.command) {
      case NAVIGATION_COMMANDS.goNext: {
        this.router.goToParentRoute()
        break
      }
      case NAVIGATION_COMMANDS.goTo: {
        const { path } = eventAction.data as NavigateTo
        this.router.goToRoute(path)
        break
      }
      case NAVIGATION_COMMANDS.goBack: {
        this.router.goBack()
        break
      }
    }
  }

  destroy() {
    this.removeSubscription()
  }
}
