jest.mock('./track')

import {
  AudioInfo,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { AudioList } from './list'
import { AudioTrack } from './track'

describe('audio-list', () => {
  const createAudio = (trackId: string): AudioInfo => {
    return {
      trackId,
      src: '',
      type: AudioType.music,
      loop: false,
      discard: DiscardStrategy.route,
      mode: LoadStrategy.queue,
    }
  }

  const createTrack = (trackId: string): AudioTrack => {
    return new AudioTrack(createAudio(trackId), () => {})
  }

  it('findTrack', () => {
    const id = 'track-01'
    // Arguments
    const track = createTrack(id)

    // Method call
    const audioList = new AudioList()
    audioList.items.push(track)
    let results = audioList.findTrack(id)

    expect(track).toBe(results)
  })

  it('discard ', () => {
    const track1 = createTrack('track-01')
    const track2 = createTrack('track-02')
    track2.discard = DiscardStrategy.none

    // Method call
    const audioList = new AudioList()
    audioList.items.push(track1)
    audioList.items.push(track2)

    audioList.discard(DiscardStrategy.route)

    expect(audioList.items.length).toBe(1)
  })

  it('destroy', () => {
    const track1 = createTrack('track-01')

    track1.destroy = jest.fn()

    // Method call
    const audioList = new AudioList()
    audioList.items.push(track1)

    audioList.destroy()

    expect(track1.destroy).toBeCalled()
  })
})
