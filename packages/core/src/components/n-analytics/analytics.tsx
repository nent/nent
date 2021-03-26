import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
} from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { commonState, LocationSegments } from '../../services/common'
import { AnalyticsActionListener } from './analytics/actions'

/**
 * This component serves as a proxy to delegate event-based
 * functions to be consumed by various analytics snippets.
 *
 * @system routing
 * @actions true
 */
@Component({
  tag: 'n-analytics',
  shadow: false,
})
export class Analytics {
  private listener!: AnalyticsActionListener

  /**
   * Raised analytics events.
   */
  @Event({
    eventName: 'event',
    composed: false,
    cancelable: false,
    bubbles: false,
  })
  event!: EventEmitter<any>

  /**
   * Page views.
   */
  @Event({
    eventName: 'page-view',
    composed: false,
    cancelable: false,
    bubbles: false,
  })
  pageView!: EventEmitter<any>

  /**
   * View percentage views.
   */
  @Event({
    eventName: 'view-time',
    composed: false,
    cancelable: false,
    bubbles: false,
  })
  viewTime!: EventEmitter<any>

  componentWillLoad() {
    commonState.analyticsEnabled = true

    if (commonState.actionsEnabled) {
      this.listener = new AnalyticsActionListener(actionBus, eventBus)
      this.listener.handleEvent = e => this.event.emit(e)
      this.listener.handlePageView = (e: LocationSegments) =>
        this.pageView.emit(`${e.pathname}?${e.search}`)
      this.listener.handleViewTime = e => this.viewTime.emit(e)
    }
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    commonState.analyticsEnabled = false
    this.listener.destroy()
  }
}
