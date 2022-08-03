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
  ScrollToId,
} from './interfaces'
import { RouterService } from './router'

/* It listens to the `NAVIGATION_TOPIC` topic and when it receives an event, it calls the appropriate
method on the `RouterService` class */
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

  /**
   * `notifyRouterInitialized()` is a function that emits an event to the `Router`'s `EventEmitter`
   * object
   */
  notifyRouterInitialized() {
    logIf(commonState.debug, `route event: initialized`)
    this.events.emit(ROUTE_EVENTS.Initialized, {})
  }

  /**
   * It emits a route change event
   * @param {string} newPath - The new path that the router is navigating to.
   */
  notifyRouteChangeStarted(newPath: string) {
    logIf(commonState.debug, `route event: started ${newPath}`)
    this.events.emit(ROUTE_EVENTS.RouteChangeStart, newPath)
  }

  /**
   * `notifyRouteChanged` is a function that emits a `RouteChanged` event
   * @param {LocationSegments} location - LocationSegments
   */
  notifyRouteChanged(location: LocationSegments) {
    logIf(commonState.debug, `route event: changed`)
    this.events.emit(ROUTE_EVENTS.RouteChanged, location)
  }

  /**
   * `notifyRouteFinalized` is a function that takes a `location` parameter and emits a
   * `ROUTE_EVENTS.RouteChangeFinish` event
   * @param {LocationSegments} location - LocationSegments
   */
  notifyRouteFinalized(location: LocationSegments) {
    logIf(commonState.debug, `route event: finalized`)
    this.events.emit(ROUTE_EVENTS.RouteChangeFinish, location)
  }

  /**
   * It emits a RouteMatched event
   * @param {Route} route - The route that was matched
   * @param {MatchResults} match - MatchResults
   */
  notifyMatch(route: Route, match: MatchResults) {
    logIf(commonState.debug, `route event: matched`)
    this.events.emit(ROUTE_EVENTS.RouteMatched, {
      route,
      match,
    })
  }

  /**
   * `notifyMatchExact` is a function that emits a `RouteMatchedExact` event
   * @param {Route} route - The route that was matched
   * @param {MatchResults} match - MatchResults
   */
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
        this.router.goNext()
        break
      }
      case NAVIGATION_COMMANDS.goBack: {
        this.router.goBack()
        break
      }
      case NAVIGATION_COMMANDS.goToParent: {
        this.router.goToParentRoute()
        break
      }
      case NAVIGATION_COMMANDS.goTo: {
        const { path } = eventAction.data as NavigateTo
        this.router.goToRoute(path)
        break
      }
      case NAVIGATION_COMMANDS.back: {
        this.router.history.goBack()
        break
      }
      case NAVIGATION_COMMANDS.scrollTo: {
        const { id } = eventAction.data as ScrollToId
        this.router.scrollToId(id)
        break
      }
    }
  }

  /**
   * It removes the subscription to the observable.
   */
  destroy() {
    this.removeSubscription()
  }
}
