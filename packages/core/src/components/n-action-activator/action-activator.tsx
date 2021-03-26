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
  ActionActivationStrategy,
  IActionElement,
} from '../../services/actions'
import { debugIf, isValue, warn } from '../../services/common'

/**
 * This element defines how or when a group of actions are
 * activated. The actions activated must be included between
 * this elements tags.
 *
 * @system actions
 */
@Component({
  tag: 'n-action-activator',
  shadow: false,
})
export class ActionActivator {
  @State() actions: Array<IActionElement> = []
  @Element() el!: HTMLNActionActivatorElement
  @State() activated = false

  /**
   * The activation strategy to use for the contained actions.
   */
  @Prop() activate:
    | 'on-render'
    | 'on-element-event'
    | 'on-enter'
    | 'at-time'
    | 'on-exit' = 'on-element-event'

  /**
   * The element to watch for events when using the OnElementEvent
   * activation strategy. This element uses the HTML Element querySelector
   * function to find the element.
   *
   * For use with activate="on-element-event" Only!
   */
  @Prop() targetElement?: string

  /**
   * This is the name of the event/s to listen to on the target element
   * separated by comma.
   */
  @Prop() targetEvent: string = 'click,keydown'

  /**
   * The time, in seconds at which the contained actions should be submitted.
   *
   * For use with activate="at-time" Only!
   */
  @Prop() time?: number

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug: boolean = false

  /**
   * Limit the activation to ONCE. This could be helpful if an action
   * has side-effects if it is run multiple times.
   *
   * Note: the activation
   * state is stored in memory and does not persist across refreshes.
   */
  @Prop() once: boolean = false

  /**
   * Manually activate all actions within this activator.
   */
  @Method()
  async activateActions(): Promise<void> {
    if (this.once && this.activated) return

    const values: Record<string, any> = {}

    this.childInputs.forEach((el: any, index: number) => {
      values[el.id || el.name || index] = el.value || el.checked
    })

    // Activate children
    await Promise.all(
      this.actions.map(async action => {
        //const data = action.data

        //Object.assign(data, values)

        //const dataString = JSON.stringify(data)
        debugIf(
          this.debug,
          `n-action-activator:  ${
            this.parent?.url || ''
          } Activating [${this.activate}~{topic: ${
            action?.topic
          }, command:${action?.command}]`,
        )
        await action.sendAction(values)
      }),
    )

    this.activated = true
  }

  private get childInputs() {
    return this.el.querySelectorAll('input,select,textarea')
  }

  private get parent():
    | HTMLNViewPromptElement
    | HTMLNViewElement
    | null {
    return (
      this.el.closest('n-view-prompt') || this.el.closest('n-view')
    )
  }

  private get childActions(): IActionElement[] {
    const actions = Array.from(this.el.querySelectorAll('n-action'))

    const audioMusicActions = Array.from(
      this.el.querySelectorAll('n-audio-action-music'),
    )

    const audioSoundActions = Array.from(
      this.el.querySelectorAll('n-audio-action-sound'),
    )

    return [
      ...actions,
      ...audioMusicActions,
      ...audioSoundActions,
    ] as IActionElement[]
  }

  async componentDidLoad() {
    debugIf(
      this.debug,
      `n-action-activator: ${this.parent?.url || ''} loading`,
    )
    if (this.childActions.length === 0) {
      warn(
        `n-action-activator: ${
          this.parent?.url || ''
        } no children actions detected`,
      )
      return
    }

    this.childActions.forEach(async a => {
      const action = await a.getAction()
      if (!action) return

      const dataString = JSON.stringify(action.data)
      debugIf(
        this.debug,
        `n-action-activator: ${this.parent?.url || ''} registered [${
          this.activate
        }~{topic: ${action?.topic}, command:${
          action?.command
        }, data: ${dataString}}}] `,
      )
      this.actions.push(a)
    })

    if (this.activate === ActionActivationStrategy.OnElementEvent) {
      const element = this.targetElement
        ? this.el.ownerDocument.querySelector(this.targetElement)
        : this.el.querySelector(
            ':enabled:not(n-action):not(n-audio-action-music):not(n-audio-action-sound):not(script):not(n-action-activator)',
          )

      if (!element) {
        warn(
          `n-action-activator: ${
            this.parent?.url || ''
          } no elements found for '${this.targetElement || 'na'}'`,
        )
      } else {
        debugIf(
          this.debug,
          `n-action-activator: element found ${element.nodeName}`,
        )
        const events = this.targetEvent
          .split(',')
          .filter(e => isValue(e))

        events.forEach(event => {
          this.debug,
            `n-action-activator: element event ${event} registered on ${element.nodeName}`,
            element.addEventListener(event, async () => {
              const { url } = this.parent || { url: '' }
              debugIf(
                this.debug,
                `n-action-activator: ${url} received ${element.nodeName} ${this.targetEvent} event`,
              )
              await this.activateActions()
            })
        })
      }
    } else if (this.activate === ActionActivationStrategy.OnRender) {
      await this.activateActions()
    }
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }
}
