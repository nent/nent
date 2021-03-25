import { newSpecPage } from '@stencil/core/testing'
import { XUI } from './x-ui'

describe('x-ui', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XUI],
      html: `<x-ui></x-ui>`,
    })
    expect(page.root).toEqualHtml(`
      <x-ui>
        <mock:shadow-root>
        </mock:shadow-root>
      </x-ui>
    `)
  })
})
