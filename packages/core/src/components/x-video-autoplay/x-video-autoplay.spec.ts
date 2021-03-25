import { newSpecPage } from '@stencil/core/testing'
import { videoState, videoStateDispose } from '../x-video/video/state'
import { XVideoAutoplay } from './x-video-autoplay'

describe('x-video-autoplay', () => {
  afterEach(() => {
    videoStateDispose()
  })
  it('enables auto-play', async () => {
    const page = await newSpecPage({
      components: [XVideoAutoplay],
      html: `<x-video-autoplay enabled><div></div></x-video-autoplay>`,
    })
    expect(page.root).toEqualHtml(`
      <x-video-autoplay enabled>
      <div></div>
      </x-video-autoplay>
    `)

    expect(videoState.autoplay).toBeTruthy()
  })

  it('disables auto-play', async () => {
    const page = await newSpecPage({
      components: [XVideoAutoplay],
      html: `<x-video-autoplay enabled="false"><div></div></x-video-autoplay>`,
    })
    expect(page.root).toEqualHtml(`
      <x-video-autoplay enabled="false">
      <div></div>
      </x-video-autoplay>
    `)

    expect(videoState.autoplay).toBeFalsy()
  })
})
