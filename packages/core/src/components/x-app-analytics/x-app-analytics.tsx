import { Component, Event, EventEmitter } from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { LocationSegments } from '../../services/common'
import { AnalyticsActionListener } from './analytics'

/**
 * This component serves as a proxy to delegate event-based
 * functions to be consumed by various analytics snippets.
 *
 * @system routing
 * @actions true
 */
@Component({
  tag: 'x-app-analytics',
  shadow: false,
})
export class XAppAnalytics {
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
    this.listener = new AnalyticsActionListener(actionBus, eventBus)
    this.listener.handleEvent = e => this.event.emit(e)
    this.listener.handlePageView = (e: LocationSegments) =>
      this.pageView.emit(`${e.pathname}?${e.search}`)
    this.listener.handleViewTime = e => this.viewTime.emit(e)
  }

  render() {
    return null
  }

  disconnectedCallback() {
    this.listener.destroy()
  }
}
