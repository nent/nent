import { EventAction } from '../../../services/actions/interfaces'
import { debugIf, IEventEmitter } from '../../../services/common'
import {
  LocationSegments,
  ROUTE_EVENTS,
} from '../../n-views/services/interfaces'
import {
  ANALYTICS_COMMANDS,
  ANALYTICS_EVENTS,
  ANALYTICS_TOPIC,
} from './interfaces'

/* It listens for events on the `ANALYTICS_TOPIC` topic and calls the appropriate handler method */
export class AnalyticsActionListener {
  private readonly removeSubscription: Array<() => void> = []

  /**
   * The constructor function is called when the class is instantiated. It takes in the `actions` and
   * `events` objects, and subscribes to the `ANALYTICS_TOPIC` and `ROUTE_EVENTS.RouteChanged` events
   * @param {IEventEmitter} actions - IEventEmitter - This is the event emitter that is used to listen
   * for the ANALYTICS_TOPIC.
   * @param {IEventEmitter} events - IEventEmitter - This is the event emitter that is used to listen
   * to events.
   * @param {boolean} [debug=false] - boolean - If true, will log all events to the console.
   */
  constructor(
    private actions: IEventEmitter,
    private events: IEventEmitter,
    private debug: boolean = false,
  ) {
    this.removeSubscription.push(
      this.actions.on(ANALYTICS_TOPIC, e => {
        this.handleEventAction(e)
      }),
    )
    this.removeSubscription.push(
      this.events.on(
        ROUTE_EVENTS.RouteChanged,
        (location: LocationSegments) => {
          this.handlePageView?.call(this, location)
        },
      ),
    )

    this.events.emit(ANALYTICS_EVENTS.ListenerRegistered, this)
  }

  public handleEvent?: (data: any) => void
  public handleViewTime?: (data: any) => void
  public handlePageView?: (data: any) => void

  private handleEventAction(eventAction: EventAction<any>) {
    debugIf(
      this.debug,
      `analytics-listener: action received ${JSON.stringify(
        eventAction,
      )}`,
    )

    switch (eventAction.command) {
      case ANALYTICS_COMMANDS.SendEvent: {
        this.handleEvent?.call(this, eventAction.data)
        break
      }
      case ANALYTICS_COMMANDS.SendViewTime: {
        this.handleViewTime?.call(this, eventAction.data)
        break
      }
      case ANALYTICS_COMMANDS.SendPageView: {
        this.handlePageView?.call(this, eventAction.data)
        break
      }
    }
  }

  /**
   * It removes all subscriptions.
   */
  public destroy() {
    this.removeSubscription.forEach(d => d())
  }
}
