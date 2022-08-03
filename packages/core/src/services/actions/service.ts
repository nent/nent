import { actionBus } from '.'
import { commonState, debugIf, warn } from '../common'
import { EventAction, IActionElement } from './interfaces'

/***
  It provides a method to get an action object from an action element, and a method to send that
  action object to the action bus
***/
export class ActionService {
  constructor(
    private element: IActionElement,
    private elementName: string,
  ) {}

  /**
   * It takes the data from the form, resolves any tokens, and returns an event action
   * @returns An object with a topic, command, and data property.
   */
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

    if (!this.element.valid) return null

    if (commonState.dataEnabled) {
      if (this.element.when) {
        const { evaluatePredicate } = await import(
          '../data/expressions'
        )
        let predicateResult = await evaluatePredicate(
          this.element.when,
        )
        if (predicateResult == false) {
          debugIf(
            commonState.debug,
            `${this.elementName}: not fired, predicate '${this.element.when}' evaluated to false`,
          )
          return null
        }
      }

      const { hasToken, resolveTokens } = await import(
        '../data/tokens'
      )

      // resolve token values
      await Promise.all(
        Object.keys(data).map(async key => {
          const value = data[key]
          if (typeof value == 'string' && hasToken(value)) {
            data[key] = await resolveTokens(value)
          }
        }),
      )
    }

    return {
      topic: this.element.topic,
      command: this.element.command,
      data,
    }
  }

  /**
   * It gets the action from the element, if it exists, and if the element is valid, it emits the
   * action on the action bus
   * @param [data] - An object containing data to be sent with the action.
   */
  async sendAction(data?: Record<string, void>): Promise<void> {
    const action = await this.element.getAction()

    if (action && this.element.valid) {
      if (data) Object.assign(action.data, data)
      actionBus.emit(action.topic, action)
    }
  }
}
