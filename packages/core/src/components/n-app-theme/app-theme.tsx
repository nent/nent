import { Component, Element, Prop } from '@stencil/core'
import { appState, onAppChange } from '../n-app/services/state'

/**
 * This component checks for the preferred light/dark theme preference of the
 * user and sets the ui state: theme, accordingly.
 *
 * @system app
 */
@Component({
  tag: 'n-app-theme',
  shadow: true,
})
export class AppTheme {
  @Element() el!: HTMLNAppThemeElement

  /**
   * Skip adding the class to the body tag, just
   * update the ui state.
   */
  @Prop() skipClass: boolean = false
  private uiSubscription!: () => void

  /**
   * Change the class name that is added to the
   * body tag when the theme is determined to
   * be dark.
   */
  @Prop() darkClass: string = 'dark'

  componentWillLoad() {
    this.uiSubscription = onAppChange('theme', theme => {
      this.toggleDarkTheme(theme === 'dark')
    })

    if (appState.theme != null) {
      this.toggleDarkTheme(appState.theme === 'dark')
    } else {
      const prefersDark = window?.matchMedia(
        '(prefers-color-scheme: dark)',
      )
      if (prefersDark?.addEventListener) {
        prefersDark.addEventListener('change', ev => {
          appState.theme = ev.matches ? 'dark' : 'light'
        })
        appState.theme = 'dark'
      }
    }
  }

  private toggleDarkTheme(dark: boolean) {
    if (!this.skipClass)
      this.el.ownerDocument.body.classList.toggle(
        this.darkClass,
        dark,
      )
  }

  disconnectedCallback() {
    this.uiSubscription?.call(this)
  }
}
