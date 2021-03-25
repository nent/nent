import { newSpecPage } from '@stencil/core/testing'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { XElements } from './x-elements'

describe('x-elements', () => {
  afterEach(() => {
    commonStateDispose()
  })
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XElements],
      html: `<x-elements><div></div></x-elements>`,
    })
    expect(page.root).toEqualHtml(`
      <x-elements>
        <div></div>
      </x-elements>
    `)

    expect(commonState.elementsEnabled).toBeTruthy()
  })
})
