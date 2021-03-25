jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { XContentReveal } from './x-content-reveal'

describe('x-content-reveal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentReveal],
      html: `<x-content-reveal>
             </x-content-reveal>`,
    })
    expect(page.root).toEqualHtml(`
      <x-content-reveal>
      <mock:shadow-root>
        <div class="x-reveal" style="animation-duration: 500ms; animation-delay: 0ms; --distance: 30%;">
          <slot></slot>
        </div>
        </mock:shadow-root>
      </x-content-reveal>
    `)

    page.root?.remove()
  })
})
