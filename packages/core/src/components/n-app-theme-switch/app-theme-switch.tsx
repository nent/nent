import { Component, h, Host, Prop } from '@stencil/core'
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
  @Prop() classes?: string

  /**
   * The inner input ID
   */
  @Prop() inputId?: string = 'dark-mode'

  render() {
    return (
      <Host>
        {appState.darkMode != null ? (
          <input
            type="checkbox"
            ref={el => (this.checkbox = el!)}
            class={this.classes}
            id={this.inputId}
            onChange={() => {
              appState.darkMode = this.checkbox.checked
            }}
            checked={appState.darkMode}
          />
        ) : (
          <input
            type="checkbox"
            ref={el => (this.checkbox = el!)}
            class={this.classes}
            id={this.inputId}
            onChange={() => {
              appState.darkMode = this.checkbox.checked
            }}
            indeterminate
          />
        )}
      </Host>
    )
  }
}
