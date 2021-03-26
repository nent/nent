import {
  EventAction,
  IEventActionListener,
} from '../../../services/actions'
import { IEventEmitter } from '../../../services/common/interfaces'
import { debugIf } from '../../../services/common/logging'
import { commonState } from '../../../services/common/state'
import { ELEMENTS_COMMANDS, ELEMENTS_TOPIC } from './interfaces'

export class ElementsActionListener implements IEventActionListener {
  actionsSubscription!: () => void
  eventBus!: IEventEmitter
  private body!: HTMLBodyElement

  initialize(
    win: Window,
    actionBus: IEventEmitter,
    eventBus: IEventEmitter,
  ): void {
    this.body = win.document.body as HTMLBodyElement
    this.eventBus = eventBus
    this.actionsSubscription = actionBus.on(
      ELEMENTS_TOPIC,
      async (ev: EventAction<any>) => {
        debugIf(
          commonState.debug,
          `elements-listener: action received ${ev.topic}:${ev.command}`,
        )
        await this.commandReceived(ev.command, ev.data)
      },
    )
  }

  private async commandReceived(command: string, data: any) {
    switch (command) {
      case ELEMENTS_COMMANDS.toggleClass: {
        this.toggleClass(data)
        break
      }

      case ELEMENTS_COMMANDS.addClasses: {
        this.addClasses(data)
        break
      }

      case ELEMENTS_COMMANDS.removeClasses: {
        this.removeClasses(data)
        break
      }

      case ELEMENTS_COMMANDS.setAttribute: {
        this.setAttribute(data)
        break
      }

      case ELEMENTS_COMMANDS.removeAttribute: {
        this.removeAttribute(data)
        break
      }

      case ELEMENTS_COMMANDS.callMethod: {
        this.callMethod(data)
        break
      }

      default:
    }
  }

  toggleClass(args: any) {
    const { selector, className } = args
    if (!className) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && className) element.classList.toggle(className)
  }

  addClasses(args: any) {
    const { selector, classes } = args
    if (!classes) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes.split(' ').forEach((c: string) => {
        element.classList.add(c)
      })
  }

  removeClasses(args: any) {
    const { selector, classes } = args
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && classes)
      classes?.split(' ').forEach((c: string) => {
        element?.classList.remove(c)
      })
  }

  setAttribute(args: any) {
    const { selector, attribute, value } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute)
      element.setAttribute(attribute, value || '')
  }

  removeAttribute(args: any) {
    const { selector, attribute } = args
    if (!attribute) return
    const element = this.body.querySelector(selector) as HTMLElement
    if (element && attribute) element?.removeAttribute(attribute)
  }

  callMethod(args: any) {
    const { selector, method, data } = args
    if (!method) return
    const element = this.body.querySelector(selector)
    if (element) {
      const elementMethod = element[method]
      if (elementMethod && typeof element === 'function') {
        elementMethod(data)
      }
    }
  }

  destroy() {
    this.actionsSubscription()
  }
}
