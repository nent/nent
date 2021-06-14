import { IEventEmitter } from '../../../../services/common'
import { log, warn } from '../../../../services/common/logging'
import { APP_EVENTS } from '../interfaces'
import { appState, onAppChange } from '../state'

export class DefaultAppProvider {
  private disposeThemeSubscription!: () => void

  constructor(
    private win: Window = window,
    eventBus?: IEventEmitter,
  ) {
    this.disposeThemeSubscription = onAppChange('darkMode', t => {
      if (t == null) win?.localStorage.removeItem('darkMode')
      else win?.localStorage.setItem('darkMode', t!.toString())
      eventBus?.emit(APP_EVENTS.ThemeChanged, t)
    })

    win.addEventListener('storage', () => {
      this.getTheme()
    })
    this.getTheme()
  }

  private getTheme() {
    const mode = this.win?.localStorage.getItem('darkMode')
    if (mode != null) {
      appState.darkMode = mode == 'true'
    } else {
      appState.darkMode = null
    }
  }

  setDarkMode(data: any) {
    const { value } = data
    appState.darkMode = value != undefined ? Boolean(value) : null
  }

  log(args: any) {
    const { message } = args
    if (message) {
      log(message)
    } else {
      console.table(args)
    }
  }

  warn(args: any) {
    const { message } = args
    if (message) {
      warn(message)
    } else {
      console.table(args)
    }
  }

  dir(args: any) {
    console.dir(args)
  }

  destroy() {
    this.disposeThemeSubscription()
  }
}
