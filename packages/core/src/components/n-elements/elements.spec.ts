import { newSpecPage } from '@stencil/core/testing'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { Elements } from './elements'

describe('elements', () => {
  afterEach(() => {
    commonStateDispose()
  })
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Elements],
      html: `<n-elements><div></div></n-elements>`,
    })
    expect(page.root).toEqualHtml(`
      <n-elements>
        <div></div>
      </n-elements>
    `)

    expect(commonState.elementsEnabled).toBeTruthy()
  })
})
