import { actionBus } from '../../../services/actions'
import {
  activateActionActivators,
  sendActions,
} from '../../../services/actions/elements'
import { ActionActivationStrategy } from '../../../services/actions/interfaces'
import { commonState } from '../../../services/common'
import { debugIf } from '../../../services/common/logging'
import {
  ANALYTICS_COMMANDS,
  ANALYTICS_TOPIC,
} from '../../n-app-analytics/services/interfaces'
import { IRoute } from '../../n-views/services/interfaces'
import {
  captureElementChildTimedNodes,
  resolveElementChildTimedNodesByTime,
  restoreElementChildTimedNodes,
} from './elements'
import {
  ITimer,
  TimeDetails,
  TimedNode,
  TIMER_EVENTS,
} from './interfaces'
import { presentationState } from './state'

export class PresentationService {
  private timedNodes: TimedNode[] | null = null
  private elements: boolean = false
  private activated: any = []
  private get actionActivators(): HTMLNActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('n-action-activator'))
  }

  private get actions(): HTMLNPresentationActionElement[] {
    return Array.from(
      this.el.querySelectorAll('n-presentation-action'),
    )
  }

  constructor(
    private el: HTMLElement,
    private timeEmitter: ITimer,
    private route: IRoute | null,
    private debug: boolean = false,
    private nextAfter: boolean | number = false,
    private analyticsEvent: string | null = null,
  ) {
    this.elements = commonState.elementsEnabled
    if (this.elements) {
      this.timedNodes = captureElementChildTimedNodes(
        this.el,
        this.nextAfter > 0
          ? (this.nextAfter as number)
          : this.timeEmitter.currentTime.duration,
      )
      debugIf(
        this.debug && this.elements,
        `elements-timer: found time-child nodes: ${this.timedNodes.length}`,
      )
    }
  }

  public async beginTimer() {
    this.timeEmitter.on(
      TIMER_EVENTS.OnInterval,
      async (time: TimeDetails) => {
        this.handleElementsInterval(time)
        this.handleAnalyticsInterval(time)
        await this.handleActionInterval(time)

        if (this.nextAfter > 0 && time.duration > this.nextAfter) {
          this.timeEmitter.emit(TIMER_EVENTS.OnEnd)
        }
      },
    )

    this.timeEmitter.on(TIMER_EVENTS.OnEnd, async () => {
      this.handleElementsEnded()
      await this.handleActionEnded()
      if (this.nextAfter || presentationState.autoNext) {
        this.route?.goNext()
      }
    })
    this.timeEmitter.begin()
  }

  private handleElementsInterval(time: TimeDetails) {
    if (this.timedNodes) {
      resolveElementChildTimedNodesByTime(
        this.el,
        this.timedNodes,
        time.elapsed,
        time.percentage,
        this.debug,
      )
    }
  }

  private handleElementsEnded() {
    if (this.timedNodes) {
      restoreElementChildTimedNodes(this.el, this.timedNodes)
    }
  }

  private lastTime = 0
  private handleAnalyticsInterval(time: TimeDetails) {
    if (commonState.analyticsEnabled && this.analyticsEvent) {
      if (time.elapsed - this.lastTime > 2) {
        actionBus.emit(ANALYTICS_TOPIC, {
          topic: ANALYTICS_TOPIC,
          command: ANALYTICS_COMMANDS.SendViewTime,
          data: {
            event: this.analyticsEvent,
            percentage: time.percentage,
            elapsed: time.elapsed,
            duration: time.duration,
          },
        })
        this.lastTime = time.elapsed
      }
    }
  }

  private async handleActionInterval(time: TimeDetails) {
    await activateActionActivators(
      this.actionActivators,
      ActionActivationStrategy.AtTime,
      activator => {
        if (this.activated.includes(activator)) return false
        if (activator.time && time.elapsed >= activator.time) {
          this.activated.push(activator)
          return true
        }
        return false
      },
    )
    await sendActions(this.actions, action => {
      return action.time && time.elapsed >= action.time
    })
  }

  private async handleActionEnded() {
    await activateActionActivators(
      this.actionActivators,
      ActionActivationStrategy.AtTimeEnd,
    )
    await sendActions(this.actions, action => {
      return action.time == 'end'
    })
  }

  public cleanup() {
    if (this.timedNodes) {
      restoreElementChildTimedNodes(this.el, this.timedNodes)
    }
    this.timeEmitter.destroy()
  }
}
