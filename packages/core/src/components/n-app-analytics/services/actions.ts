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

export class AnalyticsActionListener {
  private readonly removeSubscription: Array<() => void> = []

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

  destroy() {
    this.removeSubscription.forEach(d => d())
  }
}
