/* istanbul ignore file */

export const APP_TOPIC = 'app'

export enum APP_COMMANDS {
  RegisterProvider = 'register-provider',
  Log = 'log',
  SetTheme = 'set-theme',
}

export enum APP_EVENTS {
  ThemeChanged = 'theme',
}

export type AppProviderRegistration = {
  name: string
  provider: any
}
