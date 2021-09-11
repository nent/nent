import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import { EventAction, IActionElement } from '../../services/actions'
import { ActionService } from '../../services/actions/service'

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
  private actionService!: ActionService

  constructor() {
    this.actionService = new ActionService(this, 'n-action')
  }

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
   * A predicate to evaluate prior to sending the action.
   */
  @Prop() when?: string

  /**
   * Get the underlying actionEvent instance. Used by the n-action-activator element.
   */
  @Method()
  getAction(): Promise<EventAction<any> | null> {
    return this.actionService.getAction()
  }

  /**
   * Send this action to the action messaging system.
   */
  @Method()
  sendAction(data?: Record<string, any>) {
    return this.actionService.sendAction(data)
  }

  get childScript(): HTMLScriptElement | null {
    return this.el.querySelector('script')
  }

  get childInputs() {
    return this.el.querySelectorAll('input,select,textarea')
  }

  render() {
    return <Host></Host>
  }
}
