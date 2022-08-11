jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { videoStateDispose } from './services/state'
import { NVideo } from './video'

describe('n-video', () => {
  afterEach(() => {
    videoStateDispose()
  })
  it('enables video', async () => {
    const page = await newSpecPage({
      components: [NVideo],
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
