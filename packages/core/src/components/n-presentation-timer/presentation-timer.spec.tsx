jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { PresentationTimer } from './presentation-timer'

describe('n-presentation-timer', () => {
  it('renders empty', async () => {
    const page = await newSpecPage({
      components: [PresentationTimer],
      html: `<n-presentation-timer></n-presentation-timer>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-timer>
      </n-presentation-timer>
    `)
  })

  it('renders elapsed', async () => {
    const page = await newSpecPage({
      components: [PresentationTimer],
      html: `<n-presentation-timer duration="10" display></n-presentation-timer>`,
    })
    expect(page.root).toEqualHtml(`
      <n-presentation-timer duration="10" display="">
        0
      </n-presentation-timer>
    `)
  })
})
