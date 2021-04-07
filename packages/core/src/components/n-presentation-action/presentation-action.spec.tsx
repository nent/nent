import { newSpecPage } from '@stencil/core/testing'
import { NPresentationAction } from './presentation-action'

describe('n-presentation-action', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NPresentationAction],
      html: `<n-presentation-action></n-presentation-action>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-action>
       
      </n-presentation-action>
    `)
  })
})
