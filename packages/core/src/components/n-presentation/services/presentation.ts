import { actionBus } from '../../../services/actions'
import {
  activateActionActivators,
  sendActions
} from '../../../services/actions/elements'
import {
  ActionActivationStrategy,
  IActionElement
} from '../../../services/actions/interfaces'
import { debugIf } from '../../../services/common/logging'
import {
  ANALYTICS_COMMANDS,
  ANALYTICS_TOPIC,
  ViewTime
} from '../../n-app-analytics/services/interfaces'
import {
  captureElementChildTimedNodes,
  resolveElementChildTimedNodesByTime,
  restoreElementChildTimedNodes
} from './elements'
import {
  ITimer,
  TimeDetails,
  TimedNode,
  TIMER_EVENTS
} from './interfaces'

export class PresentationService {
  public timedNodes: TimedNode[] = []
  private intervalSubscription?: () => void
  private endSubscription?: () => void

  private get actionActivators(): HTMLNActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('n-action-activator'))
  }

  private get actions(): IActionElement[] {
    return Array.from(
      this.el.querySelectorAll('n-presentation-action'),
    ).map(a => a as unknown as IActionElement)
  }

  private activatedActions: any = []

  constructor(
    private el: HTMLElement,
    private timeEmitter: ITimer,
    private elements: boolean = false,
    private analyticsEvent: string | null = null,
    private onEnd: (() => void) | null = null,
    private debug: boolean = false,
  ) {
    if (this.elements) {
      this.timedNodes = captureElementChildTimedNodes(
        this.el,
        this.timeEmitter.duration,
      )
      debugIf(
        this.debug,
        `presentation: found  ${this.timedNodes.length} timed-child elements`,
      )
    }

    debugIf(this.debug, `presentation: service created`)
  }

  private async handleInterval(time: TimeDetails) {
    if (this.elements) {
      resolveElementChildTimedNodesByTime(
        this.el,
        this.timedNodes,
        time.elapsed,
        time.percentage,
      )
    }

    if (this.analyticsEvent) {
      const data: ViewTime = {
        event: this.analyticsEvent!,
        time,
      }

      actionBus.emit(ANALYTICS_TOPIC, {
        topic: ANALYTICS_TOPIC,
        command: ANALYTICS_COMMANDS.SendViewTime,
        data,
      })
    }

    await activateActionActivators(
      this.actionActivators,
      ActionActivationStrategy.AtTime,
      activator => {
        if (this.activatedActions.includes(activator)) return false
        if (activator.time && time.elapsed >= activator.time) {
          this.activatedActions.push(activator)
          return true
        }
        return false
      },
    )
    await sendActions(this.actions, action => {
      return action.time && time.elapsed >= action.time
    })
  }

  private async handleEnded(time: TimeDetails) {
    if (this.elements) {
      resolveElementChildTimedNodesByTime(
        this.el,
        this.timedNodes,
        time.elapsed,
        time.percentage,
      )
    }
    await activateActionActivators(
      this.actionActivators,
      ActionActivationStrategy.AtTimeEnd,
    )
    await sendActions(this.actions, action => {
      return action.time == 'end'
    })
    this.onEnd?.call(this)
  }

  public subscribe() {
    this.intervalSubscription = this.timeEmitter.on(
      TIMER_EVENTS.OnInterval,
      async (time: TimeDetails) => {
        await this.handleInterval(time)
      },
    )

    this.endSubscription = this.timeEmitter.on(
      TIMER_EVENTS.OnEnd,
      async (time: TimeDetails) => {
        debugIf(this.debug, `presentation: ended`)
        await this.handleEnded(time)
      },
    )
  }

  public unsubscribe() {
    if (this.elements) {
      restoreElementChildTimedNodes(this.el, this.timedNodes)
    }
    this.intervalSubscription?.call(this)
    this.endSubscription?.call(this)
  }
}
