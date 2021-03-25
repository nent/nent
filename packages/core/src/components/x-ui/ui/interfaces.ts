/* istanbul ignore file */

export const UI_TOPIC = 'ui'

export enum UI_COMMANDS {
  RegisterProvider = 'register-provider',
  Log = 'log',
  SetTheme = 'set-theme',
}

export enum UI_EVENTS {
  ThemeChanged = 'theme',
}

export type InterfaceProviderRegistration = {
  name: string
  provider: any
}
