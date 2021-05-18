jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { App } from '../n-app/app'
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

    commonState.dataEnabled = true

    expect(commonState.elementsEnabled).toBeTruthy()

    page.root?.remove()
  })

  it('renders data enabled', async () => {
    commonState.dataEnabled = true

    const page = await newSpecPage({
      components: [App, Elements],
      html: ` <n-app>
                <n-elements></n-elements>
                <div n-hide></div>
              </n-app>`,
    })

    expect(page.root).toEqualHtml(`
    <n-app>
      <n-elements></n-elements>
      <div hidden=""></div>
    </n-app>
    `)

    eventBus.emit(DATA_EVENTS.DataChanged, {})

    page.root?.remove()
  })
})
