jest.mock('../../../services/data/evaluate.worker')
jest.mock('./track')

import { newSpecPage, SpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../../../services/common'
import { sleep } from '../../../services/common/promises'
import { ROUTE_EVENTS } from '../../n-views/services/interfaces'
import { AudioActionListener } from './actions'
import {
  AudioType,
  AUDIO_COMMANDS,
  AUDIO_TOPIC,
  DiscardStrategy,
} from './interfaces'
import { audioStateDispose } from './state'

describe('audio-listener:', () => {
  let listener: AudioActionListener
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let events: Array<any[]>
  let page: SpecPage

  beforeEach(async () => {
    page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    events = []
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()

    page.win['Howler'] = {
      unload: jest.fn(),
      volume: () => 0,
    } as unknown as Howler

    listener = new AudioActionListener(page.win, eventBus, actionBus)

    eventBus.on('*', (...args: any[]) => {
      events.push(...args)
    })
  })

  afterEach(() => {
    listener.destroy()
    audioStateDispose()
  })

  it('music: queued, played, pause, resume and end', async () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.queue,
      data: {
        src: '/fake/path.mp3',
        trackId: 'queued-music-1',
        type: AudioType.music,
        discard: DiscardStrategy.route,
        loop: true,
      },
    })

    // when queued, and nothing is playing, the audio
    let playing = listener.music.active
    expect(playing).not.toBeNull()

    await sleep(10)
    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.pause,
      data: {},
    })

    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBeTruthy()

    // calling pause again, should cause no harm
    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.pause,
      data: {},
    })

    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBeTruthy()

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.resume,
      data: {},
    })

    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()

    // Calling resume again, should have no harm
    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.resume,
      data: {},
    })

    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})

    playing = listener.music.active
    expect(playing).toBeNull()
    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBe(false)
  })

  it('music: play immediately', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.queue,
      data: {
        src: '/fake/path1.mp3',
        trackId: 'queued-music-1',
        type: AudioType.music,
        discard: DiscardStrategy.next,
        loop: true,
      },
    })

    // when queued, and nothing is playing, the audio
    let playing = listener.music.active
    expect(playing).not.toBeNull()
    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.play,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-music-1',
        type: AudioType.music,
        discard: DiscardStrategy.route,
        loop: true,
      },
    })

    playing = listener.music.active
    expect(playing).not.toBeNull()
    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()

    expect(playing?.src).toBe('/fake/path2.mp3')
  })

  it('sound: load, play, pause, resume and end', async () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.load,
      data: {
        src: '/fake/path.mp3',
        trackId: 'sound-1',
        type: AudioType.sound,
        discard: DiscardStrategy.route,
      },
    })

    // when loaded, and nothing is playing, the audio
    // should wait
    let playing = listener.sound.active
    expect(playing).toBeNull()

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.start,
      data: {
        type: AudioType.sound,
        trackId: 'sound-1',
      },
    })

    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.pause,
      data: {},
    })

    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBeTruthy()

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.resume,
      data: {},
    })

    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})

    playing = listener.music.active
    expect(playing).toBeNull()
    expect(listener.isPlaying).toBe(false)
    expect(listener.hasAudio).toBe(false)
  })

  it('music: play, seek, mute and set volume', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.queue,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.music,
        discard: DiscardStrategy.route,
        loop: true,
      },
    })

    let playing = listener.music.active
    expect(playing).not.toBeNull()
    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()
    expect(playing?.src).toBe('/fake/path2.mp3')

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.seek,
      data: {
        type: AudioType.music,
        trackId: 'play-1',
        value: 100,
      },
    })

    expect(playing!.playing).toBeTruthy()

    // bad seek
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.seek,
      data: {
        type: AudioType.music,
        trackId: 'bad-id',
        value: 50,
      },
    })

    // @ts-ignore
    expect(playing!.time).toBe(100)

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.volume,
      data: {
        value: 0.6,
      },
    })

    expect(listener.volume).toBe(0.6)

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.mute,
      data: {
        value: true,
      },
    })

    expect(listener.muted).toBeTruthy()
  })

  it('sound: load, start', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.load,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.sound,
        discard: DiscardStrategy.route,
      },
    })

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.start,
      data: {
        type: AudioType.sound,
        trackId: 'play-1',
      },
    })

    let playing = listener.sound.active
    expect(playing).not.toBeNull()
    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()
    expect(playing?.src).toBe('/fake/path2.mp3')

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.stop,
      data: {
        type: AudioType.sound,
        trackId: 'play-1',
      },
    })

    expect(listener.isPlaying).toBeFalsy()
  })

  it('music: load, start', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.load,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.music,
        discard: DiscardStrategy.route,
      },
    })

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.start,
      data: {
        type: AudioType.music,
        trackId: 'play-1',
      },
    })

    let playing = listener.music.active
    expect(playing).not.toBeNull()
    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()
    expect(playing?.src).toBe('/fake/path2.mp3')

    listener.stop()
    expect(listener.isPlaying).toBeFalsy()

    listener.play()
    expect(listener.isPlaying).toBeTruthy()
  })

  it('sound: play', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.play,
      data: {
        src: '/fake/path2.mp3',
        trackId: 'play-1',
        type: AudioType.sound,
        discard: DiscardStrategy.route,
      },
    })

    let playing = listener.sound.active
    expect(playing).not.toBeNull()
    expect(listener.isPlaying).toBeTruthy()
    expect(listener.hasAudio).toBeTruthy()
    expect(playing?.src).toBe('/fake/path2.mp3')
  })

  it('audio: enable/disable', () => {
    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.disable,
    })

    expect(listener.enabled).toBeFalsy()

    expect(page.win.Howler.unload).toBeCalled()

    actionBus.emit(AUDIO_TOPIC, {
      topic: AUDIO_TOPIC,
      command: AUDIO_COMMANDS.enable,
    })

    expect(listener.enabled).toBeTruthy()
  })
})
