import { commonState, debugIf } from '../../../services/common'

let provider: any | null

/**
 * `setAppProvider` is a function that takes a string and an object as parameters and sets the value of
 * the `provider` variable to the object.
 * @param {string} name - The name of the provider.
 * @param {any} p - the provider object
 */
export function setAppProvider(name: string, p: any) {
  debugIf(commonState.debug, `app-provider: ${name} registered`)
  provider = p
}

/**
 * It returns the provider if it exists, otherwise it returns null
 * @returns The provider variable.
 */
export function getAppProvider(): any | null {
  return provider
}

/**
 * It clears the app provider.
 */
export function clearAppProvider() {
  provider = null
}
