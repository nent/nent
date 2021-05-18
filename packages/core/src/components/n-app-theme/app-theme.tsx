import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
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
  private uiSubscription!: () => void
  @Element() el!: HTMLNAppThemeElement
  @State() systemDark: boolean = false

  /**
   * Change the element that is decorated with
   * the dark-mode class
   */
  @Prop() targetElement: string = 'body'

  /**
   * Change the class name that is added to the
   * target element when the theme is determined to
   * be dark.
   */
  @Prop() darkClass: string = 'dark'

  /**
   * Display the user's system preference.
   */
  @Prop() display: boolean = false

  componentWillLoad() {
    const prefersDark = window?.matchMedia(
      '(prefers-color-scheme: dark)',
    )
    if (prefersDark?.addEventListener) {
      prefersDark.addEventListener('change', ev => {
        this.systemDark = ev.matches
        appState.theme = ev.matches ? 'dark' : 'light'
      })
    }

    if (appState.theme != null) {
      this.toggleDarkTheme(appState.theme === 'dark')
    }
    this.uiSubscription = onAppChange('theme', theme => {
      this.toggleDarkTheme(theme === 'dark')
    })
  }

  private toggleDarkTheme(dark: boolean) {
    this.el.ownerDocument
      .querySelector(this.targetElement)
      ?.classList.toggle(this.darkClass, dark)
  }

  render() {
    if (this.display) {
      return <Host>{this.systemDark ? this.darkClass : 'light'}</Host>
    }
  }

  disconnectedCallback() {
    this.uiSubscription?.call(this)
  }
}
