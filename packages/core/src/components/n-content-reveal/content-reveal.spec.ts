jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { ContentReveal } from './content-reveal'

describe('n-content-reveal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentReveal],
      html: `<n-content-reveal>
             </n-content-reveal>`,
    })
    expect(page.root).toEqualHtml(`
      <n-content-reveal>
      <mock:shadow-root>
        <div class="n-reveal" style="animation-duration: 500ms; animation-delay: 0ms; --distance: 30%;">
          <slot></slot>
        </div>
        </mock:shadow-root>
      </n-content-reveal>
    `)

    page.root?.remove()
  })
})
