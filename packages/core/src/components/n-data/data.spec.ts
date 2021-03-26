import { newSpecPage } from '@stencil/core/testing'
import {
  commonState,
  commonStateDispose,
} from '../../services/common/state'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { Data } from './data'

describe('n-data', () => {
  afterEach(() => {
    commonStateDispose()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [Data],
      html: `<n-data></n-data>`,
    })
    expect(page.root).toEqualHtml(`
      <n-data>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </n-data>
    `)

    expect(commonState.dataEnabled).toBeTruthy()
    expect(dataState.enabled).toBeTruthy()
  })
})
