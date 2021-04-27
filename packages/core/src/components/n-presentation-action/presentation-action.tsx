import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
} from '@stencil/core'
import { actionBus } from '../../services/actions'
import {
  EventAction,
  IActionElement,
} from '../../services/actions/interfaces'
import { warn } from '../../services/common/logging'

/**
 * This specialized action contains the time attribute,
 * allowing it to be activated directly within the n-presentation
 * element (no n-action-activator needed)
 *
 * @system presentation
 *
 */
@Component({
  tag: 'n-presentation-action',
  shadow: false,
})
export class NPresentationAction implements IActionElement {
  private sent: boolean = false
  @Element() el!: HTMLNPresentationActionElement
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
   * The time this should execute
   */
  @Prop() atTime?: number | 'end'

  /**
   * Get the underlying actionEvent instance. Used by the n-action-activator element.
   */
  @Method()
  async getAction(): Promise<EventAction<any> | null> {
    if (!this.topic) {
      warn(
        `n-presentation-action: unable to fire action, missing topic`,
      )
      return null
    }

    if (!this.command) {
      warn(
        `n-presentation-action: unable to fire action, missing command`,
      )
      return null
    }

    let data = Object.assign({}, this.el.dataset)
    return {
      topic: this.topic,
      command: this.command,
      data,
    }
  }

  /**
   * Send this action to the the action messaging system.
   */
  @Method()
  async sendAction(data?: Record<string, any>) {
    const action = await this.getAction()
    if (action && !this.sent) {
      if (data) Object.assign(action.data, data)
      actionBus.emit(action.topic, action)
      this.sent = true
    }
  }

  render() {
    return <Host></Host>
  }
}
