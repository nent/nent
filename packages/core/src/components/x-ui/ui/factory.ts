import { commonState, debugIf } from '../../../services/common'

let provider: any | null

export function setUIProvider(name: string, p: any) {
  debugIf(commonState.debug, `document-provider: ${name} registered`)
  provider = p
}

export function getUIProvider(): any | null {
  return provider
}

export function clearUIProvider() {
  provider = null
}
