import { IEventEmitter } from '../../../../services/common'
import {
  dir,
  log,
  table,
  warn,
} from '../../../../services/common/logging'
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

  log(data: any) {
    const { message } = data
    if (message) {
      log(message)
    } else {
      table(data)
    }
  }

  warn(data: any) {
    const { message } = data
    if (message) {
      warn(message)
    } else {
      table(data)
    }
  }

  dir(data: any) {
    dir(data)
  }

  destroy() {
    this.disposeThemeSubscription()
  }
}
