jest.mock('./track')

import {
  AudioInfo,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { AudioLoader } from './list-loader'

describe('audio-loader', () => {
  const createAudio = (trackId: string = '01'): AudioInfo => {
    return {
      trackId,
      src: '',
      type: AudioType.music,
      loop: false,
      discard: DiscardStrategy.route,
      mode: LoadStrategy.queue,
    }
  }

  it('load', () => {
    // Arguments
    const info = createAudio()
    let destroyed = false
    let changed = false

    // Method call
    const audioLoader = new AudioLoader()
    audioLoader.load(info, () => {
      changed = true
    })

    expect(audioLoader.items.length).toBe(1)

    audioLoader.items[0].destroy = () => {
      destroyed = true
    }

    audioLoader.items[0].onEnd!()

    expect(changed).toBeTruthy()
    expect(destroyed).toBeTruthy()
  })
})
