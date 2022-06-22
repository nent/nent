import { newSpecPage } from '@stencil/core/testing'
import { Content } from './content'

describe('n-content', () => {
  test('renders', async () => {
    const page = await newSpecPage({
      components: [Content],
      html: `<n-content><h1>Test</h1></n-content>`,
      supportsShadowDom: false,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content>
        <h1>Test</h1>
      </n-content>
    `)

    page.root?.remove()
  })
})
