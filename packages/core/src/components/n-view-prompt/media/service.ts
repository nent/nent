import { ActionActivationStrategy } from '../../../services/actions/interfaces'
import { debugIf } from '../../../services/common/logging'
import { IRoute } from '../../../services/routing/interfaces'
import {
  captureElementChildTimedNodes,
  captureXBackClickEvent,
  captureXLinkClickEvent,
  captureXNextClickEvent,
  getChildInputValidity,
  resolveElementChildTimedNodesByTime,
  restoreElementChildTimedNodes,
} from './elements'
import {
  IViewDoTimer,
  TimeDetails,
  TimedNode,
  TIMER_EVENTS,
} from './interfaces'

export class ViewDoService {
  private timedNodes: TimedNode[] = []

  private get actionActivators(): HTMLNActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('n-action-activator'))
  }

  constructor(
    private el: HTMLElement,
    private timeEmitter: IViewDoTimer,
    private route: IRoute,
    private autoNext: boolean = false,
    private debug: boolean = false,
  ) {
    this.captureChildElements()

    this.timedNodes = captureElementChildTimedNodes(
      this.el,
      this.timeEmitter.currentTime.duration,
    )

    const activated: any = []
    this.timeEmitter.on(
      TIMER_EVENTS.OnInterval,
      async (time: TimeDetails) => {
        resolveElementChildTimedNodesByTime(
          this.el,
          this.timedNodes,
          time.elapsed,
          time.percentage,
          debug,
        )

        await this.route.activateActions(
          this.actionActivators,
          ActionActivationStrategy.AtTime,
          activator => {
            if (activated.includes(activator)) return false
            if (activator.time && time.elapsed >= activator.time) {
              activated.push(activator)
              return true
            }
            return false
          },
        )
      },
    )

    this.timeEmitter.on(TIMER_EVENTS.OnEnd, async () => {
      restoreElementChildTimedNodes(this.el, this.timedNodes)
      if (this.autoNext) {
        await this.next('timer', TIMER_EVENTS.OnEnd)
      }
    })

    debugIf(
      this.debug && this.timedNodes.length > 0,
      `element-timer: ${this.route.path} found time-child nodes: ${this.timedNodes.length}`,
    )
  }

  public async beginTimer() {
    this.timeEmitter.begin()
  }

  public async captureChildElements(el: HTMLElement = this.el) {
    debugIf(
      this.debug,
      `n-view-prompt: ${this.route.path} resolve children called`,
    )

    captureXBackClickEvent(el, tag => this.back(tag, 'click'))

    captureXNextClickEvent(el, (tag, route) =>
      this.next(tag, 'click', route),
    )

    captureXLinkClickEvent(el, (tag, route) =>
      this.next(tag, 'click', route),
    )
  }

  public back(element: string, eventName: string) {
    debugIf(
      this.debug,
      `n-view-prompt: ${this.route.path} back fired from ${element}:${eventName}`,
    )
    this.cleanup()
    this.route.goBack()
  }

  public async next(
    element: string,
    eventName: string,
    path?: string | null,
  ) {
    debugIf(
      this.debug,
      `n-view-prompt: ${this.route.path} next fired from ${element}:${eventName}`,
    )
    const valid = getChildInputValidity(this.el)
    if (valid) {
      this.cleanup()
      if (path) {
        this.route.goToRoute(path)
      } else {
        this.route.goToParentRoute()
      }
    }
  }

  public cleanup() {
    restoreElementChildTimedNodes(this.el, this.timedNodes)
    this.timeEmitter.destroy()
  }
}
