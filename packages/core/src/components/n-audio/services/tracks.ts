import { Mutex } from '../../../services/common/mutex'
import { getDataProvider } from '../../../services/data/factory'
import { IServiceProvider } from '../../../services/data/interfaces'
import { InMemoryProvider } from '../../../services/data/providers/memory'

const tracksKey = 'tracks'
const sessionFallback = new InMemoryProvider()

const collectionMutex = new Mutex()

function parseTracks(tracks: string | null): string[] {
  return JSON.parse(tracks || '[]')
}

function stringifyTracks(tracks: string[]) {
  return JSON.stringify(tracks || '[]')
}

export async function getSessionTracks() {
  const unlock = await collectionMutex.lock()
  var provider = (await getDataProvider('session')) || sessionFallback
  const tracks = await provider.get(tracksKey)
  unlock()
  return tracks ? parseTracks(tracks) : []
}

export async function setSessionTracks(tracks: string[]) {
  return await collectionMutex.dispatch(async () => {
    const provider = ((await getDataProvider('session')) ||
      sessionFallback) as IServiceProvider
    await provider.set(tracksKey, stringifyTracks(tracks))
  })
}

export async function playedTrack(trackId: string) {
  const tracks = await getSessionTracks()
  return tracks.includes(trackId)
}

export async function markTrack(trackId: string) {
  const tracks = await getSessionTracks()
  if (tracks.includes(trackId)) return
  tracks.push(trackId)
  await setSessionTracks(tracks)
}

export async function clearTracks() {
  await setSessionTracks([])
}
