import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { debugIf, warn } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { IView } from '../n-view/services/interfaces'
import { Route } from '../n-view/services/route'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'
import { IElementTimer, ITimer } from './services/interfaces'
import { PresentationService } from './services/presentation'

/**
 * This element encapsulates a timed presentation. This element uses
 * a child n-presentation-timer or n-video element to create time-events
 * then it delegates those events to time-based action-activators.
 *
 * If enabled, the n-attributes for time will also get processed. This
 * element also has the ability to go to the next route using the active
 * route's 'goNext' function.
 *
 * @system presentation
 * @extension elements
 *
 */
@Component({
  tag: 'n-presentation',
  shadow: false,
})
export class Presentation {
  private presentation?: PresentationService
  private navigationSubscription?: () => void
  @Element() el!: HTMLNPresentationElement
  @State() elementWithTimer: IElementTimer | null = null
  @State() timer: ITimer | null = null

  /**
   * The element selector for the timer-element to
   * bind for interval events. If left blank, it looks
   * first an n-timer, then for the first n-video.
   *
   * If none are found, it creates one manually and starts
   * it immediately
   */
  @Prop() timerElement: string | null = null

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug: boolean = false

  /**
   * Go to the next view after the timer ends
   */
  @Prop() nextAfter: boolean | string = false

  /**
   * Send analytics view-time percentages for this presentation
   * using the event name
   */
  @Prop() analyticsEvent?: string

  private get currentRoute(): Route | null {
    const parent =
      this.el.closest('n-view-prompt') || this.el.closest('n-view')
    if (parent) return (parent as IView).route
    return routingState.router?.exactRoute || null
  }

  componentWillLoad() {
    debugIf(this.debug, `n-presentation: loading`)
    let element: HTMLElement | null = this.timerElement
      ? this.el.querySelector(this.timerElement) ||
        this.el.ownerDocument.querySelector(this.timerElement) ||
        null
      : this.el.querySelector('n-presentation-timer') ||
        this.el.ownerDocument.querySelector('n-presentation-timer') ||
        this.el.querySelector('n-video') ||
        this.el.ownerDocument.querySelector('n-video') ||
        null

    this.elementWithTimer =
      (element as unknown as IElementTimer) || null

    if (this.elementWithTimer == null) {
      warn(`n-presentation: no timer element found`)
      return
    } else {
      this.elementWithTimer.addEventListener('ready', () => {
        debugIf(this.debug, `n-presentation: element ready`)
        this.timer = this.elementWithTimer!.timer
        this.presentation = new PresentationService(
          this.el,
          this.timer,
          commonState.elementsEnabled,
          this.analyticsEvent,
          () => {
            if (this.currentRoute && this.nextAfter) {
              this.presentation?.unsubscribe()
              if (typeof this.nextAfter == 'string') {
                this.currentRoute.router.goToRoute(this.nextAfter)
              } else {
                this.currentRoute.router.goNext()
              }
            }
          },
          this.debug,
        )
        if (this.currentRoute) {
          debugIf(
            this.debug,
            `n-presentation: syncing to route ${this.currentRoute.path}`,
          )
          if (this.currentRoute?.match?.isExact) {
            this.presentation?.subscribe()
          }
          this.navigationSubscription = eventBus.on(
            ROUTE_EVENTS.RouteChanged,
            () => {
              if (this.currentRoute?.match?.isExact) {
                this.presentation?.subscribe()
              } else {
                this.presentation?.unsubscribe()
              }
            },
          )
        } else {
          this.presentation?.subscribe()
        }
      })
    }
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    this.presentation?.unsubscribe()
    this.navigationSubscription?.call(this)
  }
}
