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

export async function getSessionVisits() {
  var provider = (await getDataProvider('session')) || sessionFallback

  const visits = await provider.get(visitKey)
  return visits ? parseVisits(visits) : []
}

export async function setSessionVisits(visits: string[]) {
  const provider = ((await getDataProvider('session')) ||
    sessionFallback) as IServiceProvider
  if (provider) {
    await provider.set(visitKey, stringifyVisits(visits))
  }
}

export async function getStoredVisits() {
  var provider =
    (await getDataProvider(navigationState.storageProvider)) ||
    storageFallback

  const visits = await provider.get(visitKey)
  return visits ? parseVisits(visits) : []
}

export async function setStoredVisits(visits: string[]) {
  var provider = ((await getDataProvider(
    navigationState.storageProvider,
  )) || storageFallback) as IServiceProvider
  if (provider) {
    await provider.set(visitKey, stringifyVisits(visits))
  }
}

export async function hasVisited(url: string) {
  const sessionVisits = await getSessionVisits()
  const storageVisits = await getStoredVisits()
  const visits = [...sessionVisits, ...storageVisits]
  return visits.includes(url)
}

export async function recordVisit(visit: VisitStrategy, url: string) {
  if (visit == VisitStrategy.once) {
    await storeVisit(url)
  } else {
    await markVisit(url)
  }
}

export async function getVisits() {
  const sessionVisits = await getSessionVisits()
  const storedVisits = await getStoredVisits()
  return [...new Set([...sessionVisits, ...storedVisits])]
}

export async function markVisit(url: string) {
  const sessionVisits = await getSessionVisits()
  if (sessionVisits.includes(url)) return
  await setSessionVisits([...new Set([...sessionVisits, url])])
}

export async function storeVisit(url: string) {
  const storedVisits = await getStoredVisits()
  if (storedVisits.includes(url)) return
  await setStoredVisits([...new Set([...storedVisits, url])])
}

export async function clearVisits() {
  await setSessionVisits([])
  await setStoredVisits([])
}
