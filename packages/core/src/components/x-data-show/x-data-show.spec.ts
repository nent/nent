jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import { addDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import {
  dataState,
  dataStateDispose,
} from '../../services/data/state'
import { ROUTE_EVENTS } from '../../services/routing/interfaces'
import { XDataShow } from './x-data-show'

describe('x-data-show', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    dataState.enabled = true
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  afterEach(() => {
    dataStateDispose
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('renders hidden by default', async () => {
    const page = await newSpecPage({
      components: [XDataShow],
      html: `<x-data-show when="false"><p>Hide Me</p></x-data-show>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-show when="false" hidden="">
        <p>
          Hide Me
        </p>
      </x-data-show>
    `)

    const subject = page.body.querySelector('x-data-show')
    subject?.remove()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataShow],
      html: `<x-data-show when="true"><p>Show Me</p></x-data-show>`,
      supportsShadowDom: false,
    })

    eventBus.emit(ROUTE_EVENTS.RouteChanged, {})
    expect(page.root).toEqualHtml(`
      <x-data-show when="true">
        <p>
          Show Me
        </p>
      </x-data-show>
    `)

    const subject = page.body.querySelector('x-data-show')
    subject?.remove()
  })

  it('renders & changes live', async () => {
    const page = await newSpecPage({
      components: [XDataShow],
      html: `<x-data-show when="{{session:show}}"><p>Show Me</p></x-data-show>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(`
      <x-data-show when="{{session:show}}" hidden="">
        <p>
          Show Me
        </p>
      </x-data-show>
    `)

    await session.set('show', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-data-show when="{{session:show}}">
        <p>
          Show Me
        </p>
      </x-data-show>
    `)

    const subject = page.body.querySelector('x-data-show')
    subject?.remove()
  })
})
