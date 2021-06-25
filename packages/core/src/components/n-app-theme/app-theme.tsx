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
  @Element() el!: HTMLNAppThemeElement

  private stateSubscription!: () => void

  @State() systemDarkMode: boolean = false

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

  private get darkMode() {
    return appState.darkMode == null
      ? this.systemDarkMode
      : appState.darkMode
  }

  componentWillLoad() {
    this.subscribeToSystem()
  }

  private subscribeToSystem() {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )
    if (prefersDark?.addEventListener) {
      prefersDark.addEventListener('change', ev => {
        this.systemDarkMode = ev.matches
      })
      this.systemDarkMode = prefersDark.matches
    }
    this.stateSubscription = onAppChange('darkMode', () => {
      this.toggleDarkTheme()
    })
  }

  componentWillRender() {
    this.toggleDarkTheme()
  }

  private toggleDarkTheme() {
    const element =
      this.targetElement == 'body'
        ? this.el.ownerDocument.body
        : this.el.ownerDocument.querySelector(this.targetElement)

    if (this.darkMode) element?.classList.toggle(this.darkClass, true)
    else element?.classList.remove(this.darkClass)
  }

  render() {
    if (this.display) {
      return (
        <Host>
          {this.darkMode ? 'dark' : 'light'}
          {appState.darkMode == null ? ' (system) ' : ' (overridden)'}
        </Host>
      )
    }
    return null
  }

  disconnectedCallback() {
    this.stateSubscription?.call(this)
  }
}
