jest.mock('../../services/common/logging')
import { newSpecPage } from '@stencil/core/testing'
import { App } from './app'

describe('n-app', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [App],
      html: `<n-app></n-app>`,
    })
    expect(page.root).toEqualHtml(`
      <n-app>
      </n-app>
    `)
  })
})
