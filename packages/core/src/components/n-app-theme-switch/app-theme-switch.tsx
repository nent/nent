import { Component, h, Prop } from '@stencil/core'
import { appState } from '../n-app/services/state'

/**
 * This component displays a checkbox to control the
 * dark-theme setting applied to the ui.
 *
 * Default: user-preference
 *
 * @system app
 */
@Component({
  tag: 'n-app-theme-switch',
  shadow: false,
})
export class AppThemeSwitch {
  private checkbox!: HTMLInputElement

  /**
   * The class to add to the inner input.
   */
  @Prop() inputClass?: string

  /**
   * The inner input ID
   */
  @Prop() inputId?: string = 'dark-mode'

  render() {
    return (
      <input
        type="checkbox"
        ref={el => (this.checkbox = el!)}
        class={this.inputClass}
        id={this.inputId}
        onChange={() => {
          appState.darkMode = this.checkbox.checked
        }}
        checked={appState.darkMode || false}
      />
    )
  }
}
