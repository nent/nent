import { newSpecPage } from '@stencil/core/testing'
import {
  commonState,
  commonStateDispose,
} from '../../services/common/state'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { XData } from './x-data'

describe('x-data', () => {
  afterEach(() => {
    commonStateDispose()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XData],
      html: `<x-data></x-data>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-data>
    `)

    expect(commonState.dataEnabled).toBeTruthy()
    expect(dataState.enabled).toBeTruthy()
  })
})
