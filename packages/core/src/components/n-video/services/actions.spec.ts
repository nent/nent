import { newSpecPage, SpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../../../services/common/emitter'
import { sleep } from '../../../services/common/promises'
import { VideoActionListener } from './actions'
import { VIDEO_COMMANDS, VIDEO_TOPIC } from './interfaces'

describe('video-actions:', () => {
  let subject: VideoActionListener
  let video: any
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let events: Array<any[]>
  let page: SpecPage
  beforeAll(async () => {
    page = await newSpecPage({
      components: [],
      html: `<div></div>`,
    })
    events = []
    video = {}
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()

    subject = new VideoActionListener(
      video as HTMLVideoElement,
      eventBus,
      actionBus,
      false,
    )

    eventBus.on('*', (...args: any[]) => {
      events.push(...args)
    })
  })

  afterAll(() => {
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    subject.destroy()
  })
  it('video: play, pause, resume, mute', async () => {
    let isPlaying = false

    video.muted = false
    video.play = async () => {
      isPlaying = true
    }

    video.pause = () => {
      isPlaying = false
    }

    video.mute = (mute: boolean) => {
      video.muted = mute
    }

    actionBus.emit(VIDEO_TOPIC, {
      topic: VIDEO_TOPIC,
      command: VIDEO_COMMANDS.Play,
      data: {},
    })
    await sleep(100)

    expect(isPlaying).toBe(true)

    actionBus.emit(VIDEO_TOPIC, {
      topic: VIDEO_TOPIC,
      command: VIDEO_COMMANDS.Pause,
      data: {},
    })
    await sleep(100)

    expect(isPlaying).toBe(false)

    actionBus.emit(VIDEO_TOPIC, {
      topic: VIDEO_TOPIC,
      command: VIDEO_COMMANDS.Resume,
      data: {},
    })
    await sleep(100)

    expect(isPlaying).toBe(true)

    actionBus.emit(VIDEO_TOPIC, {
      topic: VIDEO_TOPIC,
      command: VIDEO_COMMANDS.Mute,
      data: {
        value: true,
      },
    })
    await sleep(100)

    expect(video.muted).toBe(true)
  })
})
