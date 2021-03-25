jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { videoStateDispose } from '../x-video/video/state'
import { XVideo } from './x-video'

describe('x-video', () => {
  afterEach(() => {
    videoStateDispose()
  })
  it('enables video', async () => {
    const page = await newSpecPage({
      components: [XVideo],
      html: `<x-video><video></video></x-video>`,
    })
    expect(page.root).toEqualHtml(`
      <x-video>
      <video></video>
      </x-video>
    `)

    page.root?.remove()
  })
})
