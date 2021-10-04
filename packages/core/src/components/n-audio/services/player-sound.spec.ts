jest.mock('./track')

import {
  AudioInfo,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { SoundPlayer } from './player-sound'
import { audioStateDispose } from './state'

describe('player-sound', () => {
  let index = 0
  afterEach(() => {
    audioStateDispose()
    index = 0
  })

  const createAudio = (trackId?: string): AudioInfo => {
    return {
      trackId: trackId || `T-${index++}`,
      src: '',
      type: AudioType.music,
      loop: false,
      discard: DiscardStrategy.route,
      mode: LoadStrategy.queue,
    }
  }
  it('load', () => {
    let changed = false
    const info = createAudio()

    // Method call
    const player = new SoundPlayer(() => {
      changed = true
    })
    player.load(info)

    expect(player.loader.items.length).toBe(1)
    expect(player.hasAudio()).toBeTruthy()
    expect(changed).toBeTruthy()
  })

  it('load > playTrack', () => {
    let changed = false
    const trackId = 'x-123'
    const info = createAudio(trackId)
    const player = new SoundPlayer(() => {
      changed = true
    })
    player.load(info)

    expect(player.hasAudio()).toBeTruthy()
    expect(player.loader.items.length).toBe(1)

    player.playTrack(trackId)

    let active = player.active!

    expect(active).not.toBeNull()
    active.destroy = jest.fn()

    expect(active?.playing()).toBeTruthy()

    active.onEnd!()

    expect(changed).toBeTruthy()
    expect(active.destroy).toBeCalled()
  })

  it('load 3 > playTrack ', () => {
    let changed = false

    const player = new SoundPlayer(() => {
      changed = true
    })

    player.load(createAudio('L1'))
    player.load(createAudio('L2'))
    player.load(createAudio('L3'))

    expect(player.loader.items.length).toBe(3)

    player.playTrack('L3')

    let active = player.active!

    active = player.active!

    expect(active).not.toBeNull()
    expect(active.trackId).toBe('L3')
    active.onEnd!(active)

    expect(changed).toBeTruthy()
  })

  it('discard', () => {
    let changed = false
    const reasons = DiscardStrategy.route

    // Method call
    const player = new SoundPlayer(() => {
      changed = true
    })

    player.loader.discard = jest.fn()
    player.discard(reasons)

    expect(player.loader.discard).toBeCalledWith(reasons)
  })

  it('discard, loaded track', () => {
    const reasons = DiscardStrategy.route

    // Method call
    const player = new SoundPlayer(() => {})

    player.load(createAudio())
    player.load(createAudio())
    player.load(createAudio())

    expect(player.loader.items.length).toBe(3)

    const keeper = createAudio()
    keeper.discard = DiscardStrategy.none
    player.load(keeper)

    expect(player.loader.items.length).toBe(4)

    player.discard(reasons)

    expect(player.loader.items.length).toBe(1)
  })

  it('discard multiple types, loaded track', () => {
    // Method call
    const player = new SoundPlayer(() => {})

    player.load(createAudio())
    player.load(createAudio())
    player.load(createAudio())

    const keeper = createAudio()
    keeper.discard = DiscardStrategy.none
    player.load(keeper)

    expect(player.loader.items.length).toBe(4)

    player.discard(DiscardStrategy.route, DiscardStrategy.none)

    expect(player.loader.items.length).toBe(0)
  })

  it('hasAudio, false', () => {
    // Method call
    const player = new SoundPlayer(() => {})
    expect(player.hasAudio()).toBeFalsy()
  })

  it('destroy', () => {
    let changed = false

    // Method call
    const player = new SoundPlayer(() => {
      changed = true
    })
    player.loader.destroy = jest.fn()
    player.destroy()

    expect(player.loader.destroy).toBeCalled()
  })
})
