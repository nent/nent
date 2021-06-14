import { IEventEmitter } from '../../../../services/common'
import { log, warn } from '../../../../services/common/logging'
import { APP_EVENTS } from '../interfaces'
import { appState, onAppChange } from '../state'

export class DefaultAppProvider {
  private disposeThemeSubscription!: () => void

  constructor(win: Window = window, eventBus?: IEventEmitter) {
    appState.theme = win?.localStorage.getItem('theme') || null

    this.disposeThemeSubscription = onAppChange('theme', t => {
      win?.localStorage.setItem('theme', t || 'light')
      eventBus?.emit(APP_EVENTS.ThemeChanged, t)
    })

    win.addEventListener('storage', () => {
      appState.theme = win?.localStorage.getItem('theme') || null
    })
  }

  setTheme(theme: 'dark' | 'light') {
    appState.theme = theme
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
