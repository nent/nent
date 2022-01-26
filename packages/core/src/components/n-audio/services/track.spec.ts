jest.mock('../../../services/common/logging')

import { EventEmitter } from '../../../services/common'
import {
  AudioInfo,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from './interfaces'
import { audioStateDispose } from './state'
import { AudioTrack } from './track'

class Howl extends EventEmitter {
  src!: string
  loop!: boolean
  onload?: () => void
  onend?: () => void
  onloaderror?: (id: string, error: string) => void
  onplayerror?: () => void
  preload?: boolean
  constructor(options: {
    src: string
    loop: boolean
    onload: () => void
    onend: () => void
    onloaderror: (id: string, error: string) => void
    onplayerror: () => void
    preload: boolean
  }) {
    super()
    Object.assign(this, options)
  }
  _state = 'loaded'
  state = () => this._state
  pause = jest.fn()
  play = jest.fn()
  stop = jest.fn()
  start = jest.fn()
  seek = jest.fn()
  mute = jest.fn()
  fade = jest.fn()
  volume = jest.fn()
  unload = jest.fn()
  playing = () => true
}

describe('audio-track', () => {
  let index = 0
  beforeAll(() => {
    // @ts-ignore
    global.Howl = Howl
    index = 0
  })
  afterEach(() => {
    audioStateDispose()
  })

  const createAudio = (trackId?: string): AudioInfo => {
    return {
      trackId: trackId || `t-${index++}`,
      src: '',
      type: AudioType.music,
      loop: false,
      discard: DiscardStrategy.route,
      mode: LoadStrategy.queue,
    }
  }

  it('constructor: src', () => {
    const audio = createAudio()
    const audioTrack = new AudioTrack(audio, () => {})
    expect(audioTrack.sound.src).toBe(audio.src)
  })

  it('constructor: loop', () => {
    const audio = createAudio()
    const audioTrack = new AudioTrack(audio, () => {})
    expect(audioTrack.sound.loop).toBe(audio.loop)
  })

  it('constructor: loop, sound false', () => {
    const audio = createAudio()
    audio.type = AudioType.sound
    audio.loop = true
    const audioTrack = new AudioTrack(audio, () => {})
    expect(audioTrack.sound.loop).toBe(false)
  })

  it('constructor: onend', () => {
    const audio = createAudio()
    let onEnd = false
    const audioTrack = new AudioTrack(audio, () => {
      onEnd = true
    })
    audioTrack.sound.onend()

    expect(onEnd).toBeTruthy()
  })

  it('constructor: onload', () => {
    const audio = createAudio()
    let onLoad = false
    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.onLoad = () => {
      onLoad = true
    }
    audioTrack.sound.onload()

    expect(onLoad).toBeTruthy()
  })

  it('constructor: onloaderror', () => {
    const audio = createAudio()
    let onEnd = false
    const audioTrack = new AudioTrack(audio, () => {
      onEnd = true
    })

    audioTrack.sound.onloaderror()

    expect(onEnd).toBeTruthy()
  })

  it('constructor: onplayerror', () => {
    const audio = createAudio()
    const audioTrack = new AudioTrack(audio, () => {})

    audioTrack.sound.onplayerror()

    audioTrack.sound.emit('unlock')

    expect(audioTrack.sound.play).toBeCalled()
  })

  it('method: start', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.start()

    expect(audioTrack.sound.volume).toBeCalledWith(0)
    expect(audioTrack.sound.play).toBeCalled()
  })

  it('method: start, loading', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})

    audioTrack.sound._state = 'loading'
    audioTrack.start()

    audioTrack.sound.emit('loaded')

    expect(audioTrack.sound.volume).toBeCalledWith(0)
    expect(audioTrack.sound.play).toBeCalled()
  })

  it('method: play', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.play()

    expect(audioTrack.sound.play).toBeCalled()
  })

  it('method: pause', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.pause()
    expect(audioTrack.sound.pause).toBeCalled()
  })

  it('method: stop', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.stop()
    expect(audioTrack.sound.fade).toBeCalled()
    expect(audioTrack.sound.stop).toBeCalled()
  })

  it('method: mute', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.mute(true)
    expect(audioTrack.sound.mute).toBeCalledWith(true)
  })

  it('method: resume', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.resume()
    expect(audioTrack.sound.play).toBeCalled()
  })

  it('method: setVolume', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.setVolume(0.2)

    expect(audioTrack.sound.volume).toBeCalledWith(0.2)
  })

  it('method: seek', () => {
    const audio = createAudio()

    const time1 = 10

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.seek(time1)

    expect(audioTrack.sound.seek).toBeCalledWith(time1)
  })

  it('method: destroy', () => {
    const audio = createAudio()

    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.destroy()

    expect(audioTrack.sound.unload).toBeCalled()
  })

  it('property: trackId', () => {
    const audio = createAudio()

    const trackId1 = '01'

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.trackId = trackId1
    const result = audioTrack.trackId

    // Expect result
    expect(result).toBe(trackId1)
  })

  it('property: type', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})

    const result = audioTrack.type

    // Expect result
    expect(audio.type).toBe(result)
  })

  it('property: src', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})

    // Expect result
    expect(audioTrack.src).toBe(audio.src)
  })

  it('property: mode', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})

    // Expect result
    expect(audioTrack.mode).toBe(audio.mode)
  })

  it('property: discard', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.discard = audio.discard
    const result = audioTrack.discard

    // Expect result
    expect(result).toBe(audio.discard)
  })

  it('property: playing', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})

    // Expect result
    expect(audioTrack.playing()).toBeTruthy()
  })

  it('property: state, loaded', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})

    // Expect result
    expect(audioTrack.state()).toBe('loaded')
  })

  it('property: muted', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})
    // @ts-ignore
    audioTrack.sound.volume = () => 0

    // Expect result
    expect(audioTrack.muted()).toBeTruthy()
  })

  it('property: muted, false', () => {
    const audio = createAudio()

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})
    // @ts-ignore
    audioTrack.sound.volume = () => 0.2

    // Expect result
    expect(audioTrack.muted()).toBeFalsy()
  })

  it('property: loop', () => {
    const audio = createAudio()

    const loop1 = audio.loop

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.loop = loop1
    const result = audioTrack.loop

    // Expect result
    expect(result).toBe(loop1)
  })

  it('event: onEnd', () => {
    const audio = createAudio()
    const onEnd = () => {}
    // Property call
    const audioTrack = new AudioTrack(audio, onEnd)
    const result = audioTrack.onEnd

    // Expect result
    expect(result).toBe(onEnd)
  })

  it('event: onLoad', () => {
    const audio = createAudio()

    const onLoad1 = () => {}

    // Property call
    const audioTrack = new AudioTrack(audio, () => {})
    audioTrack.onLoad = onLoad1
    const result = audioTrack.onLoad

    // Expect result
    expect(result).toBe(onLoad1)
  })
})
