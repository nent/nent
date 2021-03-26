import { newSpecPage } from '@stencil/core/testing'
import { ContentShare } from './content-share'

describe('n-content-share', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentShare],
      html: `<n-content-share>
            share me
            </n-content-share>`,
    })
    expect(page.root).toEqualHtml(`
      <n-content-share>
      <mock:shadow-root>
         <slot></slot>
       </mock:shadow-root>
        share me
      </n-content-share>
    `)
  })
})
