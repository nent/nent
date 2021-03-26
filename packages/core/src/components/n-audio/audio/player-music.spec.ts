jest.mock('./track')

import {
  AudioInfo,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { MusicPlayer } from './player-music'
import { audioStateDispose } from './state'

describe('player-music', () => {
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

  it('queueTrack, first item', () => {
    const info = createAudio()

    // Method call
    const musicPlayer = new MusicPlayer(() => {})

    musicPlayer.queueAudio(info)

    const track = musicPlayer.active

    expect(track).not.toBeNull()
    expect(track?.playing).toBeTruthy()

    expect(musicPlayer.queue.items.length).toBe(0)
  })

  it('queueTrack, two items', () => {
    let changed = false
    const info = createAudio()

    // Method call
    const musicPlayer = new MusicPlayer(() => {
      changed = true
    })

    musicPlayer.queueAudio(info)

    let active = musicPlayer.active!

    expect(active).not.toBeNull()
    active.destroy = jest.fn()

    expect(active?.playing).toBeTruthy()
    expect(changed).toBeTruthy()

    changed = false

    musicPlayer.queueAudio(createAudio('02'))

    expect(musicPlayer.queue.items.length).toBe(1)
    expect(changed).toBeTruthy()

    changed = false
    active.onEnd!()
    expect(active.destroy).toBeCalled()

    expect(changed).toBeTruthy()
    expect(musicPlayer.queue.items.length).toBe(0)

    active = musicPlayer.active!

    expect(active).not.toBeNull()
    expect(active.trackId).toBe('02')
    active.destroy = jest.fn()

    changed = false

    active.onEnd!()

    expect(changed).toBeTruthy()
    expect(active.destroy).toBeCalled()
    expect(musicPlayer.active).toBeNull()
  })

  it('load', () => {
    let changed = false
    const info = createAudio()

    // Method call
    const musicPlayer = new MusicPlayer(() => {
      changed = true
    })
    musicPlayer.load(info)

    expect(musicPlayer.loader.items.length).toBe(1)
    expect(musicPlayer.hasAudio()).toBeTruthy()
    expect(changed).toBeTruthy()
  })

  it('load > playTrack (queue:0)', () => {
    let changed = false
    const trackId = 'x-123'
    const info = createAudio(trackId)
    const musicPlayer = new MusicPlayer(() => {
      changed = true
    })
    musicPlayer.load(info)

    expect(musicPlayer.hasAudio()).toBeTruthy()
    expect(musicPlayer.loader.items.length).toBe(1)

    musicPlayer.playTrack(trackId)

    let active = musicPlayer.active!

    expect(active).not.toBeNull()
    active.destroy = jest.fn()

    expect(active?.playing).toBeTruthy()

    active.onEnd!()

    expect(changed).toBeTruthy()
    expect(active.destroy).toBeCalled()
    expect(musicPlayer.active).toBeNull()
  })

  it('load 1 > playTrack (playing:1, queue:1)', () => {
    let changed = false

    const musicPlayer = new MusicPlayer(() => {
      changed = true
    })
    musicPlayer.queueAudio(createAudio('Q1'))
    musicPlayer.queueAudio(createAudio('Q2'))

    musicPlayer.load(createAudio('L1'))

    expect(musicPlayer.loader.items.length).toBe(1)

    musicPlayer.playTrack('L1')

    expect(changed).toBeTruthy()

    let active = musicPlayer.active!
    expect(active.trackId).toBe('L1')
    active.onEnd!(active)

    active = musicPlayer.active!

    expect(active).not.toBeNull()
    expect(active.trackId).toBe('Q2')
    active.onEnd!()
  })

  it('discard is called', () => {
    const reasons = DiscardStrategy.route

    // Method call
    const musicPlayer = new MusicPlayer(() => {})

    musicPlayer.queue.discard = jest.fn()
    musicPlayer.loader.discard = jest.fn()
    musicPlayer.discard(reasons)

    expect(musicPlayer.queue.discard).toBeCalledWith(reasons)
    expect(musicPlayer.loader.discard).toBeCalledWith(reasons)
  })

  it('discard, loaded track', () => {
    const reasons = DiscardStrategy.route

    // Method call
    const musicPlayer = new MusicPlayer(() => {})

    musicPlayer.load(createAudio())
    musicPlayer.load(createAudio())
    musicPlayer.load(createAudio())

    expect(musicPlayer.loader.items.length).toBe(3)

    const keeper = createAudio()
    keeper.discard = DiscardStrategy.none
    musicPlayer.load(keeper)

    expect(musicPlayer.loader.items.length).toBe(4)

    musicPlayer.discard(reasons)

    expect(musicPlayer.loader.items.length).toBe(1)
  })

  it('discard multiple types, loaded track', () => {
    // Method call
    const musicPlayer = new MusicPlayer(() => {})

    musicPlayer.load(createAudio())
    musicPlayer.load(createAudio())
    musicPlayer.load(createAudio())

    const keeper = createAudio()
    keeper.discard = DiscardStrategy.none
    musicPlayer.load(keeper)

    expect(musicPlayer.loader.items.length).toBe(4)

    musicPlayer.discard(DiscardStrategy.route, DiscardStrategy.none)

    expect(musicPlayer.loader.items.length).toBe(0)
  })

  it('discard multiple types, queued tracks', () => {
    // Method call
    const musicPlayer = new MusicPlayer(() => {})

    musicPlayer.queueAudio(createAudio())
    musicPlayer.queueAudio(createAudio())
    musicPlayer.queueAudio(createAudio())

    const keeper = createAudio()
    keeper.discard = DiscardStrategy.none
    musicPlayer.queueAudio(keeper)

    expect(musicPlayer.queue.items.length).toBe(3)

    expect(musicPlayer.hasAudio()).toBeTruthy()

    musicPlayer.discard(DiscardStrategy.route, DiscardStrategy.none)

    expect(musicPlayer.queue.items.length).toBe(0)

    expect(musicPlayer.hasAudio()).toBeFalsy()
  })

  it('hasAudio, false', () => {
    // Method call
    const musicPlayer = new MusicPlayer(() => {})
    expect(musicPlayer.hasAudio()).toBeFalsy()
  })

  it('destroy', () => {
    let changed = false

    // Method call
    const musicPlayer = new MusicPlayer(() => {
      changed = true
    })

    musicPlayer.queue.destroy = jest.fn()
    musicPlayer.loader.destroy = jest.fn()
    musicPlayer.destroy()

    expect(musicPlayer.queue.destroy).toBeCalled()
    expect(musicPlayer.loader.destroy).toBeCalled()
  })
})
