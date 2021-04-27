import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { commonState } from '../../services/common'
import { debugIf, warn } from '../../services/common/logging'
import { IView } from '../n-view/services/interfaces'
import { Route } from '../n-view/services/route'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { navigationState } from '../n-views/services/state'
import { IElementTimer, ITimer } from './services/interfaces'
import { PresentationService } from './services/presentation'

/**
 * This component encapsulates a timed presentation. This component uses
 * a child n-presentation-timer or n-video element to create time-events
 * then it delegates those events to time-based action-activators.
 *
 * If enabled, the n-attributes for time will also get processed. This
 * component also has the ability to go to the next route using the active
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
   * If none are found, it creates on manually and starts
   * it immediately
   */
  @Prop() timerElement: string | null = null

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug: boolean = false

  /**
   * Go to the next view after when the timer ends
   */
  @Prop() nextAfter: boolean = false

  /**
   * Send analytics view-time percentages for this presentation
   * using the event name
   */
  @Prop() analyticsEvent?: string

  private get currentRoute(): Route | null {
    const parent =
      this.el.closest('n-view-prompt') || this.el.closest('n-view')
    if (parent) return (parent as IView).route
    return navigationState.router?.exactRoute || null
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
      ((element as unknown) as IElementTimer) || null

    if (this.elementWithTimer == null) {
      warn(`n-presentation: no timer element found`)
      return
    }

    if (this.currentRoute) {
      debugIf(
        this.debug,
        `n-presentation: syncing to route ${this.currentRoute.path}`,
      )
      if (this.currentRoute?.match?.isExact) {
        this.subscribeElementTimer(element)
      }
      this.navigationSubscription = eventBus.on(
        ROUTE_EVENTS.RouteChanged,
        () => {
          this.presentation?.endTimer()
          if (this.currentRoute?.match?.isExact) {
            if (this.presentation) this.presentation!.beginTimer()
            else this.subscribeElementTimer(element)
          }
        },
      )
    } else {
      this.subscribeElementTimer(element)
    }
  }

  private setPresentation() {
    this.timer = this.elementWithTimer!.timer

    this.presentation = new PresentationService(
      this.el,
      this.timer,
      commonState.elementsEnabled,
      this.analyticsEvent,
      () => {
        if (this.currentRoute && this.nextAfter) {
          this.presentation?.cleanup()
          this.currentRoute.goNext()
        }
      },
      this.debug,
    )
  }

  private subscribeElementTimer(element: any) {
    if (element) {
      debugIf(this.debug, `n-presentation: found element`)
      element.addEventListener('ready', () => {
        debugIf(this.debug, `n-presentation: element ready`)
        this.setPresentation()

        debugIf(this.debug, `n-presentation: begin timer`)
        this.presentation!.beginTimer()
      })
    } else {
      debugIf(this.debug, `n-presentation: creating internal timer`)
      this.setPresentation()

      debugIf(this.debug, `n-presentation: begin timer`)
      this.presentation!.beginTimer()
    }
  }

  render() {
    return <Host></Host>
  }

  disconnectedCallback() {
    this.timer?.destroy()
    this.timer = null
    this.presentation?.cleanup()
    delete this.presentation
    this.navigationSubscription?.call(this)
  }
}
