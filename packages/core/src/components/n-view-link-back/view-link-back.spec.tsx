import { newSpecPage } from '@stencil/core/testing'
import { NViewLinkBack } from './view-link-back'

describe('n-view-link-back', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NViewLinkBack],
      html: `<n-view-link-back><div></div></n-view-link-back>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-link-back>
      <div></div>
      </n-view-link-back>
    `)
  })
})
