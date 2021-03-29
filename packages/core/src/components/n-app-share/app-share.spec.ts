import { newSpecPage } from '@stencil/core/testing'
import { ContentShare } from './app-share'

describe('n-app-share', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentShare],
      html: `<n-app-share>
            share me
            </n-app-share>`,
    })
    expect(page.root).toEqualHtml(`
      <n-app-share>
      <mock:shadow-root>
         <slot></slot>
       </mock:shadow-root>
        share me
      </n-app-share>
    `)
  })
})
