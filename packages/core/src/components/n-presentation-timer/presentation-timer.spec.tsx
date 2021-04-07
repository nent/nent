import { newSpecPage } from '@stencil/core/testing'
import { NPresentationTimer } from './presentation-timer'

describe('n-presentation-timer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NPresentationTimer],
      html: `<n-presentation-timer></n-presentation-timer>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-timer>
      </n-presentation-timer>
    `)
  })
})
