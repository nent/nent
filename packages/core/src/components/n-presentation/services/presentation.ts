import {
  activateActionActivators,
  sendActions,
} from '../../../services/actions/elements'
import { ActionActivationStrategy } from '../../../services/actions/interfaces'
import { commonState } from '../../../services/common'
import { debugIf } from '../../../services/common/logging'
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
  ) {
    this.elements = commonState.elementsEnabled
    if (this.elements) {
      this.timedNodes = captureElementChildTimedNodes(
        this.el,
        this.timeEmitter.currentTime.duration,
      )
      debugIf(
        this.debug && this.elements,
        `elements-timer: found time-child nodes: ${this.timedNodes.length}`,
      )
    }

    const activated: any = []
    this.timeEmitter.on(
      TIMER_EVENTS.OnInterval,
      async (time: TimeDetails) => {
        if (this.timedNodes) {
          resolveElementChildTimedNodesByTime(
            this.el,
            this.timedNodes,
            time.elapsed,
            time.percentage,
            debug,
          )
        }

        await activateActionActivators(
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

        await sendActions(this.actions, action => {
          return action.time && time.elapsed >= action.time
        })

        if (this.nextAfter > 0 && time.duration > this.nextAfter) {
          this.timeEmitter.emit(TIMER_EVENTS.OnEnd)
        }
      },
    )

    this.timeEmitter.on(TIMER_EVENTS.OnEnd, async () => {
      if (this.timedNodes) {
        restoreElementChildTimedNodes(this.el, this.timedNodes)
      }
      if (this.nextAfter || presentationState.autoNext) {
        this.route?.goNext()
      }
      await activateActionActivators(
        this.actionActivators,
        ActionActivationStrategy.AtTimeEnd,
      )
      await sendActions(this.actions, action => {
        return action.time == 'end'
      })
    })
  }

  public async beginTimer() {
    this.timeEmitter.begin()
  }

  public cleanup() {
    if (this.timedNodes) {
      restoreElementChildTimedNodes(this.el, this.timedNodes)
    }
    this.timeEmitter.destroy()
  }
}
