jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { Elements } from './elements'

describe('elements', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    commonStateDispose()
  })
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Elements],
      html: `<n-elements></n-elements>`,
    })
    expect(page.root).toEqualHtml(`
      <n-elements>
      </n-elements>
    `)

    expect(commonState.elementsEnabled).toBeTruthy()

    page.root?.remove()
  })
})
