jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { videoStateDispose } from '../n-video/video/state'
import { Video } from './video'

describe('n-video', () => {
  afterEach(() => {
    videoStateDispose()
  })
  it('enables video', async () => {
    const page = await newSpecPage({
      components: [Video],
      html: `<n-video><video></video></n-video>`,
    })
    expect(page.root).toEqualHtml(`
      <n-video>
      <video></video>
      </n-video>
    `)

    page.root?.remove()
  })
})
