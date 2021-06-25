jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common/state'
import { addDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { ROUTE_EVENTS } from '../n-views/services/interfaces'
import { ContentShow } from './content-show'

describe('n-content-show', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    commonState.dataEnabled = true
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    commonStateDispose()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders hidden by default', async () => {
    const page = await newSpecPage({
      components: [ContentShow],
      html: `<n-content-show when="false"><p>Hide Me</p></n-content-show>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-show when="false" hidden="">
        <p>
          Hide Me
        </p>
      </n-content-show>
    `)

    const subject = page.body.querySelector('n-content-show')
    subject?.remove()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentShow],
      html: `<n-content-show when="true"><p>Show Me</p></n-content-show>`,
      supportsShadowDom: false,
    })

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})
    expect(page.root).toEqualHtml(`
      <n-content-show when="true">
        <p>
          Show Me
        </p>
      </n-content-show>
    `)

    const subject = page.body.querySelector('n-content-show')
    subject?.remove()
  })

  it('renders & changes live', async () => {
    const page = await newSpecPage({
      components: [ContentShow],
      html: `<n-content-show when="{{session:show}}"><p>Show Me</p></n-content-show>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <n-content-show when="{{session:show}}" hidden="">
        <p>
          Show Me
        </p>
      </n-content-show>
    `)

    await session.set('show', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-show when="{{session:show}}">
        <p>
          Show Me
        </p>
      </n-content-show>
    `)

    const subject = page.body.querySelector('n-content-show')
    subject?.remove()
  })
})
