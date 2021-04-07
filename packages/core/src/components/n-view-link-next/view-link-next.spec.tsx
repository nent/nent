import { newSpecPage } from '@stencil/core/testing'
import { NViewLinkNext } from './view-link-next'

describe('n-view-link-next', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NViewLinkNext],
      html: `<n-view-link-next><div></div></n-view-link-next>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-link-next>
      <div></div>
      </n-view-link-next>
    `)
  })
})
