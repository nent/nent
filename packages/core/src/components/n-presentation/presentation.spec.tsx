import { newSpecPage } from '@stencil/core/testing'
import { NPresentation } from './presentation'

describe('n-presentation', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NPresentation],
      html: `<n-presentation></n-presentation>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation>
      </n-presentation>
    `)
  })
})
