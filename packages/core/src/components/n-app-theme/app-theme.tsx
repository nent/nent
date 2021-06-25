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
  shadow: false,
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

  /**
   * This component displays the current theme,
   * unless in switch-mode, it will show the opposite.
   */
  @Prop() switch: boolean = false

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

    if (appState.darkMode)
      element?.classList.toggle(this.darkClass, true)
    else element?.classList.remove(this.darkClass)
  }

  render() {
    if (this.display) {
      const swap = this.switch
        ? !appState.darkMode
        : appState.darkMode
      return (
        <Host>
          <svg
            class="themeIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            {swap ? (
              <path d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z" />
            ) : (
              <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
            )}
          </svg>
        </Host>
      )
    }
    return null
  }

  disconnectedCallback() {
    this.stateSubscription?.call(this)
  }
}
