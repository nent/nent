import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { commonStateDispose } from '../../services/common'
import { ViewLinkBack } from './view-link-back'

describe('n-view-link-back', () => {
  beforeEach(() => {})

  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    commonStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ViewLinkBack],
      html: `<n-view-link-back></n-view-link-back>`,
    })
    expect(page.root).toEqualHtml(`
      <n-view-link-back>
      </n-view-link-back>
    `)

    page.root?.remove()
  })
})
