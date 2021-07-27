import { Component, Event, EventEmitter, Prop } from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  debugIf,
  LocationSegments,
} from '../../services/common'
import { ViewTime } from './services'
import { AnalyticsActionListener } from './services/actions'

/**
 * This element serves as a proxy to delegate event-based
 * functions to be consumed by various analytics snippets.
 *
 * @system app
 * @extension actions
 */
@Component({
  tag: 'n-app-analytics',
  shadow: true,
})
export class Analytics {
  private listener!: AnalyticsActionListener

  /**
   * Turn on debugging to get helpful messages from the
   * app, routing, data and action systems.
   */
  @Prop() debug: boolean = false

  /**
   * Raised analytics events.
   */
  @Event({
    eventName: 'custom-event',
    composed: false,
    cancelable: false,
    bubbles: true,
  })
  event!: EventEmitter<any>

  /**
   * Page views.
   */
  @Event({
    eventName: 'page-view',
    composed: false,
    cancelable: false,
    bubbles: true,
  })
  pageView!: EventEmitter<LocationSegments>

  /**
   * View percentage views.
   */
  @Event({
    eventName: 'view-time',
    composed: false,
    cancelable: false,
    bubbles: true,
  })
  viewTime!: EventEmitter<ViewTime>

  componentWillLoad() {
    debugIf(this.debug, `n-app-analytics: loading`)
    commonState.analyticsEnabled = true

    this.listener = new AnalyticsActionListener(
      actionBus,
      eventBus,
      this.debug,
    )
    this.listener.handleEvent = e => {
      this.event.emit(e)
    }
    this.listener.handlePageView = (e: LocationSegments) => {
      this.pageView.emit(e)
    }
    this.listener.handleViewTime = (e: ViewTime) => {
      this.viewTime.emit(e)
    }
    debugIf(this.debug, `n-app-analytics: loaded`)
  }

  render() {
    return null
  }

  disconnectedCallback() {
    commonState.analyticsEnabled = false
    this.listener.destroy()
  }
}
