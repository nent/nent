import { newSpecPage } from '@stencil/core/testing'
import { ViewLinkNext } from './view-link-next'

describe('n-view-link-next', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewLinkNext],
      html: `<n-view-link-next></n-view-link-next>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-link-next>
      </n-view-link-next>
    `)
  })
})
