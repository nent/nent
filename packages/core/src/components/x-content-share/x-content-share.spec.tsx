import { newSpecPage } from '@stencil/core/testing'
import { XContentShare } from './x-content-share'

describe('x-content-share', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentShare],
      html: `<x-content-share>
            share me
            </x-content-share>`,
    })
    expect(page.root).toEqualHtml(`
      <x-content-share>
      <mock:shadow-root>
         <slot></slot>
       </mock:shadow-root>
        share me
      </x-content-share>
    `)
  })
})
