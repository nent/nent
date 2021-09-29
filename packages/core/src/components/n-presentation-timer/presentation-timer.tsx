import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { debugIf } from '../../services/common'
import {
  IElementTimer,
  ITimer,
} from '../n-presentation/services/interfaces'
import { IView } from '../n-view/services/interfaces'
import { Route } from '../n-view/services/route'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'
import { FrameTimer } from './services/timer'

/**
 * This element creates a timer for the presentation
 * element to use in place of a video, to time actions
 * or manipulate HTML by time.
 *
 * @system presentation
 */
@Component({
  tag: 'n-presentation-timer',
  shadow: false,
})
export class PresentationTimer implements IElementTimer {
  @Element() el!: HTMLNPresentationTimerElement
  @State() elapsed: number = 0
  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  /**
   * Normalized timer.
   */
  @Prop({ mutable: true }) timer!: ITimer

  /**
   * Duration before the timer stops and raises
   * the ended event. 0 = never
   */
  @Prop() duration: number = 0

  /**
   * Interval in milliseconds to request
   * between the getAnimationFrame. This
   * affects the precision.
   */
  @Prop() interval: number = 200

  /**
   * Display elapsed seconds
   */
  @Prop() display: boolean = false

  /**
   * If set, disables auto-starting the timer
   * on render. This will be removed if in a view,
   * when the view is activated or when the start
   * method is called.
   */
  @Prop({ mutable: true }) deferLoad = false

  /**
   * Ready event letting the presentation layer know it can
   * begin.
   */
  @Event({
    eventName: 'ready',
  })
  ready!: EventEmitter
  private navigationSubscription?: () => void

  private get currentRoute(): Route | null {
    const parent =
      this.el.closest('n-view-prompt') || this.el.closest('n-view')
    if (parent) return (parent as IView).route
    return routingState.router?.exactRoute || null
  }

  /**
   * Begin the timer. This is called automatically
   * by the presentation element.
   */
  @Method()
  async begin() {
    this.timer!.begin()
  }

  /**
   * Stop the timer.
   */
  @Method()
  async stop() {
    this.timer!.stop()
  }

  componentWillLoad() {
    this.timer = new FrameTimer(
      window,
      this.interval,
      this.duration,
      () => performance.now(),
      () => {
        this.elapsed = this.timer.currentTime.elapsed
      },
      this.debug,
    )
  }

  render() {
    return <Host>{this.display ? this.elapsed : null}</Host>
  }

  componentDidLoad() {
    this.ready.emit(true)
    if (this.currentRoute) {
      debugIf(
        this.debug,
        `n-presentation-timer: syncing to route ${this.currentRoute.path}`,
      )
      if (this.currentRoute?.match?.isExact) {
        this.timer.begin()
      }
      this.navigationSubscription = eventBus.on(
        ROUTE_EVENTS.RouteChanged,
        () => {
          if (this.currentRoute?.match?.isExact) {
            this.timer.begin()
          } else {
            this.timer.stop()
          }
        },
      )
    } else {
      this.timer.begin()
    }
  }

  disconnectedCallback() {
    this.timer.destroy()
    this.navigationSubscription?.call(this)
  }
}
