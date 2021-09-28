import { actionBus } from '.'
import { commonState, debugIf, warn } from '../common'
import { evaluatePredicate } from '../data/expressions'
import { EventAction, IActionElement } from './interfaces'

export class ActionService {
  constructor(
    private element: IActionElement,
    private elementName: string,
  ) {}

  async getAction(): Promise<EventAction<any> | null> {
    if (!this.element.topic) {
      warn(
        `${this.elementName}: unable to fire action, missing topic`,
      )
      return null
    }

    if (!this.element.command) {
      warn(
        `${this.elementName}: unable to fire action, missing command`,
      )
      return null
    }

    let data: Record<string, any> = { ...this.element.el.dataset }

    if (this.element.childScript) {
      Object.assign(
        data,
        JSON.parse(this.element.childScript!.textContent || '{}'),
      )
    }

    this.element.valid = true
    this.element.childInputs.forEach((el: any, index: number) => {
      if (el.checkValidity?.call(el) === false) {
        el.reportValidity?.call(el)
        this.element.valid = false
      } else {
        data[el.id || el.name || index] =
          el.value || (el.type == 'checkbox' ? el.checked : null)
      }
    })

    return {
      topic: this.element.topic,
      command: this.element.command,
      data,
    }
  }

  async sendAction(data?: Record<string, void>): Promise<void> {
    const action = await this.element.getAction()

    if (this.element.when && commonState.dataEnabled) {
      const predicateResult = await evaluatePredicate(
        this.element.when,
      )
      if (predicateResult == false) {
        debugIf(
          commonState.debug,
          `${this.elementName}: not fired, predicate '${this.element.when}' evaluated to false`,
        )
        return
      }
    }

    if (action && this.element.valid) {
      if (data) Object.assign(action.data, data)
      actionBus.emit(action.topic, action)
    }
  }
}
