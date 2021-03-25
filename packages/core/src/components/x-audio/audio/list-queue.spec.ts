jest.mock('./track')

import {
  AudioInfo,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { AudioQueue } from './list-queue'
import { audioStateDispose } from './state'
import { AudioTrack } from './track'

describe('audio-queue', () => {
  let index = 0
  afterEach(() => {
    audioStateDispose()
    index = 0
  })

  const createAudio = (trackId?: string): AudioInfo => {
    return {
      trackId: trackId || `A-${index++}`,
      src: '',
      type: AudioType.music,
      loop: false,
      discard: DiscardStrategy.route,
      mode: LoadStrategy.queue,
    }
  }

  const createTrack = (trackId?: string) => {
    return new AudioTrack(createAudio(trackId))
  }

  it('queueAudio', () => {
    // Arguments
    const info = createAudio()
    let destroyed = false
    let ended = false

    // Method call
    const audioQueue = new AudioQueue()
    audioQueue.queueAudio(info, () => {
      ended = true
    })
    expect(audioQueue.items.length).toBe(1)

    const track = audioQueue.items[0]
    track.destroy = () => {
      destroyed = true
    }

    track.onEnd!()

    expect(ended).toBeTruthy()
    expect(destroyed).toBeTruthy()
  })

  it('insertTrack (queue: 2)', () => {
    let destroyed = false

    // Method call
    const audioQueue = new AudioQueue()
    audioQueue.queueAudio(createAudio(), () => {})
    audioQueue.queueAudio(createAudio(), () => {})
    expect(audioQueue.items.length).toBe(2)

    audioQueue.insertTrack(createTrack(), () => {
      destroyed = true
    })

    let track = audioQueue.items[0]

    expect(track.trackId).toBe('A-2')
  })

  it('queueAudio, duplicate', () => {
    // Arguments
    const info = createAudio('A1')

    // Method call
    const audioQueue = new AudioQueue()
    audioQueue.queueAudio(info, () => {})
    expect(audioQueue.items.length).toBe(1)
    audioQueue.queueAudio(info, () => {})
    expect(audioQueue.items.length).toBe(1)
  })

  it('getNext', () => {
    // Arguments
    const info = createAudio()

    // Method call
    const audioQueue = new AudioQueue()
    audioQueue.queueAudio(info, () => {})
    expect(audioQueue.items.length).toBe(1)

    const track = audioQueue.getNext()

    expect(track).not.toBeUndefined()

    expect(audioQueue.items.length).toBe(0)
  })
})
