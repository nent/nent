import {
  EventAction,
  IEventActionListener,
} from '../../../services/actions'
import { EventEmitter } from '../../../services/common/emitter'
import { IEventEmitter } from '../../../services/common/interfaces'
import { debugIf } from '../../../services/common/logging'
import { commonState } from '../../../services/common/state'
import { ELEMENTS_COMMANDS, ELEMENTS_TOPIC } from './interfaces'

/* It listens for actions on the `ELEMENTS_TOPIC` topic and executes the corresponding command on the
element(s) specified by the `selector` property */
export class ElementsActionListener implements IEventActionListener {
  actionsSubscription!: () => void
  eventBus!: IEventEmitter
  changed: EventEmitter = new EventEmitter()
  private body!: HTMLBodyElement

  /**
   * It listens for events on the action bus, and when it receives one, it calls the `commandReceived`
   * function
   * @param {Window} win - Window - the window object of the browser
   * @param {IEventEmitter} actionBus - This is the event bus that the extension listens to for
   * commands from the extension.
   * @param {IEventEmitter} eventBus - This is the event bus that the plugin is using to communicate
   * with the rest of the application.
   */
  public initialize(
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
        this.changed.emit('changed')
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
