jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import {
  dataState,
  dataStateDispose,
} from '../../../services/data/state'

import {
  clearTracks,
  getSessionTracks,
  markTrack,
  playedTrack,
  setSessionTracks,
} from './tracks'

describe('audio-tracks', () => {
  beforeAll(() => {
    dataState.providerTimeout = 0
  })
  afterEach(() => {
    dataStateDispose()
  })

  it('markTrack', async () => {
    await markTrack('1')
    expect(await playedTrack('1')).toBe(true)
    await clearTracks()
  })

  it('getSessionTracks', async () => {
    await markTrack('1')
    const tracks = await getSessionTracks()
    expect(tracks).toHaveLength(1)
    await clearTracks()
  })

  it('setSessionTracks', async () => {
    await setSessionTracks(['1'])
    expect(await playedTrack('1')).toBe(true)
    await clearTracks()
  })
})
