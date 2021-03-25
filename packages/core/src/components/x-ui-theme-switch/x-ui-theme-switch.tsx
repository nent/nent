import { Component, h, Host, Prop, State } from '@stencil/core'
import { onUIChange, uiState } from '../x-ui/ui'

/**
 * This component displays a checkbox to control the
 * dark-theme setting applied to the ui.
 *
 * Default: user-preference
 *
 * @system ui
 */
@Component({
  tag: 'x-ui-theme-switch',
  shadow: false,
})
export class XUIThemeSwitch {
  private uiSubscription!: () => void

  @State() dark: boolean = false

  /**
   * The class to add to the inner input.
   */
  @Prop() classes?: string

  /**
   * The inner input ID
   */
  @Prop() inputId?: string

  componentWillLoad() {
    this.dark = uiState.theme == 'dark'
    this.uiSubscription = onUIChange('theme', theme => {
      this.toggleDarkTheme(theme === 'dark')
    })
  }

  private toggleDarkTheme(dark: boolean) {
    this.dark = dark
    uiState.theme = this.dark ? 'dark' : 'light'
  }

  disconnectedCallback() {
    this.uiSubscription()
  }

  render() {
    return (
      <Host>
        <input
          type="checkbox"
          class={this.classes}
          id={this.inputId}
          onChange={() => this.toggleDarkTheme(!this.dark)}
          checked={this.dark}
        />
      </Host>
    )
  }
}
