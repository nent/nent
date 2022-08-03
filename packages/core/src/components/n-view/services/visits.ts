import { Mutex } from '../../../services/common/mutex'
import { getDataProvider } from '../../../services/data/factory'
import { IServiceProvider } from '../../../services/data/interfaces'
import { InMemoryProvider } from '../../../services/data/providers/memory'
import { VisitStrategy } from './interfaces'
import { navigationState } from './state'

const visitKey = 'visits'
const sessionFallback = new InMemoryProvider()
const storageFallback = new InMemoryProvider()

function parseVisits(visits: string | null): string[] {
  return JSON.parse(visits || '[]')
}

function stringifyVisits(visits: string[]) {
  return JSON.stringify(visits || '[]')
}

const sessionMutex = new Mutex()

/**
 * It gets the session visits from the session data provider, or the session fallback if the session
 * data provider is not available
 * @returns An array of visits.
 */
export async function getSessionVisits() {
  return await sessionMutex.dispatch(async () => {
    var provider =
      (await getDataProvider('session')) || sessionFallback
    const visits = await provider.get(visitKey)
    return visits ? parseVisits(visits) : []
  })
}

/**
 * It takes an array of strings, and then it sets the session visits to that array of strings
 * @param {string[]} visits - string[] - An array of strings representing the visits to be stored.
 * @returns A promise that resolves to the result of the dispatch function.
 */
export async function setSessionVisits(visits: string[]) {
  return await sessionMutex.dispatch(async () => {
    const provider = ((await getDataProvider('session')) ||
      sessionFallback) as IServiceProvider
    await provider.set(visitKey, stringifyVisits(visits))
  })
}

const storageMutex = new Mutex()

/**
 * It gets the visits from the storage provider, and if there's no storage provider, it uses the
 * fallback
 * @returns An array of objects.
 */
export async function getStoredVisits() {
  return await storageMutex.dispatch(async () => {
    var provider =
      (await getDataProvider(navigationState.storageProvider)) ||
      storageFallback
    const visits = await provider.get(visitKey)
    return visits ? parseVisits(visits) : []
  })
}

/**
 * It takes an array of strings, and stores them in the browser's storage
 * @param {string[]} visits - string[] - An array of strings representing the visits to be stored.
 * @returns A promise that resolves to the result of the async function.
 */
export async function setStoredVisits(visits: string[]) {
  return await storageMutex.dispatch(async () => {
    var provider = ((await getDataProvider(
      navigationState.storageProvider,
    )) || storageFallback) as IServiceProvider
    await provider.set(visitKey, stringifyVisits(visits))
  })
}

/**
 * It returns true if the given URL is in the list of visits, and false otherwise
 * @param {string} url - The URL of the page you want to check.
 * @returns A boolean value.
 */
export async function hasVisited(url: string) {
  const sessionVisits = await getSessionVisits()
  const storageVisits = await getStoredVisits()
  const visits = [...sessionVisits, ...storageVisits]
  return visits.includes(url)
}

/**
 * "If the visit strategy is once, store the visit, otherwise mark the visit."
 *
 * The function is written in TypeScript, which is a superset of JavaScript. TypeScript is a typed
 * language, which means that it has a type system. The type system is used to catch errors at compile
 * time
 * @param {VisitStrategy} visit - VisitStrategy - this is the visit strategy that the user has chosen.
 * @param {string} url - The URL to visit
 */
export async function recordVisit(visit: VisitStrategy, url: string) {
  if (visit == VisitStrategy.once) {
    await storeVisit(url)
  } else {
    await markVisit(url)
  }
}

/**
 * It gets the session visits and stored visits, then combines them into a single array, removing
 * duplicates
 * @returns An array of unique visits.
 */
export async function getVisits() {
  const sessionVisits = await getSessionVisits()
  const storedVisits = await getStoredVisits()
  return [...new Set([...sessionVisits, ...storedVisits])]
}

/**
 * It gets the current session's visits, checks if the current page is already in the list, and if not,
 * adds it to the list
 * @param {string} url - The URL of the page that was visited.
 * @returns An array of unique URLs that have been visited in the current session.
 */
export async function markVisit(url: string) {
  const sessionVisits = await getSessionVisits()
  if (sessionVisits.includes(url)) return
  await setSessionVisits([...new Set([...sessionVisits, url])])
}

/**
 * It stores a visit to a URL in local storage
 * @param {string} url - The URL of the page that was visited.
 * @returns An array of unique urls
 */
export async function storeVisit(url: string) {
  const storedVisits = await getStoredVisits()
  if (storedVisits.includes(url)) return
  await setStoredVisits([...new Set([...storedVisits, url])])
}

/**
 * It clears the session and stored visits
 */
export async function clearVisits() {
  await setSessionVisits([])
  await setStoredVisits([])
}
