import { commonState, debugIf } from '../../../services/common'

let provider: any | null

export function setAppProvider(name: string, p: any) {
  debugIf(commonState.debug, `app-provider: ${name} registered`)
  provider = p
}

export function getAppProvider(): any | null {
  return provider
}

export function clearAppProvider() {
  provider = null
}
