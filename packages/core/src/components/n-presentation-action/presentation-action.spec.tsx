import { newSpecPage } from '@stencil/core/testing'
import { NPresentationAction } from './n-presentation-action'

describe('n-presentation-action', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NPresentationAction],
      html: `<n-presentation-action></n-presentation-action>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-action>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </n-presentation-action>
    `)
  })
})
