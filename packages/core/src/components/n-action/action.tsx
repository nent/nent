import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import {
  actionBus,
  EventAction,
  IActionElement,
} from '../../services/actions'
import { warn } from '../../services/common/logging'

/**
 * This element just holds data to express the actionEvent to fire. This element
 * should always be the child of an n-action-activator.
 *
 * @system actions
 */
@Component({
  tag: 'n-action',
  shadow: false,
})
export class Action implements IActionElement {
  @Element() el!: HTMLNActionElement
  @State() valid: boolean = true

  /**
   * This is the topic this action-command is targeting.
   *
   */
  @Prop() topic!: string

  /**
   * The command to execute.
   */
  @Prop() command!: string

  /**
   * Get the underlying actionEvent instance. Used by the n-action-activator element.
   */
  @Method()
  async getAction(): Promise<EventAction<any> | null> {
    if (!this.topic) {
      warn(`n-action: unable to fire action, missing topic`)
      return null
    }

    if (!this.command) {
      warn(`n-action: unable to fire action, missing command`)
      return null
    }

    let data: Record<string, any> = { ...this.el.dataset }

    if (this.childScript) {
      Object.assign(
        data,
        JSON.parse(this.childScript!.textContent || '{}'),
      )
    }

    this.valid = true
    this.childInputs.forEach((el: any, index: number) => {
      if (el.checkValidity?.call(el) === false) {
        el.reportValidity?.call(el)
        this.valid = false
      } else {
        data[el.id || el.name || index] =
          el.value || (el.type == 'checkbox' ? el.checked : null)
      }
    })

    return {
      topic: this.topic,
      command: this.command,
      data,
    }
  }

  /**
   * Send this action to the action messaging system.
   */
  @Method()
  async sendAction(data?: Record<string, any>) {
    const action = await this.getAction()
    if (action && this.valid) {
      if (data) Object.assign(action.data, data)
      actionBus.emit(action.topic, action)
    }
  }

  private get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  private get childInputs() {
    return this.el.querySelectorAll('input,select,textarea')
  }

  render() {
    return <Host></Host>
  }
}
