import { MockWindow } from '@stencil/core/mock-doc'
import { IEventEmitter } from '../../../../services/common'
import { log, warn } from '../../../../services/common/logging'
import { UI_EVENTS } from '../interfaces'
import { onUIChange, uiState } from '../state'

export class DefaultUIProvider {
  private disposeThemeSubscription!: () => void

  constructor(
    win: MockWindow | Window = window,
    eventBus?: IEventEmitter,
  ) {
    uiState.theme = win?.localStorage.getItem('theme') || null

    this.disposeThemeSubscription = onUIChange('theme', t => {
      win?.localStorage.setItem('theme', t || 'light')
      eventBus?.emit(UI_EVENTS.ThemeChanged, t)
    })
  }

  setTheme(theme: 'dark' | 'light') {
    uiState.theme = theme
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
