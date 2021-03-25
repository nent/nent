import { getDataProvider } from '../data/factory'
import { IServiceProvider } from '../data/interfaces'
import { InMemoryProvider } from '../data/providers/memory'
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
  if (provider) {
    const visits = await provider.get(visitKey)
    return visits ? parseVisits(visits) : []
  }

  return []
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
  if (provider) {
    const visits = await provider.get(visitKey)
    return visits ? parseVisits(visits) : []
  }

  return []
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
  const visits = [
    ...(await getSessionVisits()),
    ...(await getStoredVisits()),
  ]
  return visits.includes(url)
}

export async function recordVisit(visit: VisitStrategy, url: string) {
  if (visit == VisitStrategy.once) {
    await storeVisit(url)
  } else {
    await markVisit(url)
  }
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
