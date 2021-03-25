import { Component, Element, Prop } from '@stencil/core'
import { onUIChange, uiState } from '../x-ui/ui'

/**
 * This component checks for the preferred light/dark theme preference of the
 * user and sets the ui state: theme, accordingly.
 *
 * @system ui
 */
@Component({
  tag: 'x-ui-theme',
  shadow: true,
})
export class XUITheme {
  @Element() el!: HTMLXUiThemeElement

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
    this.uiSubscription = onUIChange('theme', theme => {
      this.toggleDarkTheme(theme === 'dark')
    })

    if (uiState.theme != null) {
      this.toggleDarkTheme(uiState.theme === 'dark')
    } else {
      const prefersDark = window?.matchMedia(
        '(prefers-color-scheme: dark)',
      )
      if (prefersDark?.addEventListener) {
        prefersDark.addEventListener('change', ev => {
          uiState.theme = ev.matches ? 'dark' : 'light'
        })
        uiState.theme = 'dark'
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
