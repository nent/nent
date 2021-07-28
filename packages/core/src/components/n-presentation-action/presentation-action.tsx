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
  EventAction,
  IActionElement,
} from '../../services/actions/interfaces'
import { ActionService } from '../../services/actions/service'

/**
 * This specialized action contains the time attribute,
 * allowing it to be activated directly within the n-presentation
 * element (no n-action-activator needed)
 *
 * @system presentation
 * @system actions
 */
@Component({
  tag: 'n-presentation-action',
  shadow: false,
})
export class NPresentationAction implements IActionElement {
  @State() valid: boolean = true
  @Element() el!: HTMLNPresentationActionElement

  private actionService!: ActionService
  constructor() {
    this.actionService = new ActionService(this)
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
   * The time this should execute
   */
  @Prop() time?: number | 'end'

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
  async sendAction(data?: Record<string, any>) {
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
