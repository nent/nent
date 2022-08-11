jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import * as elements from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { Elements } from './elements'

describe('elements', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    commonStateDispose()
  })
  it('sets elementsEnabled to true', async () => {
    const page = await newSpecPage({
      components: [Elements],
      html: `<n-elements></n-elements>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-elements>
      </n-elements>
    `)

    expect(commonState.elementsEnabled).toBeTruthy()

    page.root!.remove()

    expect(commonState.elementsEnabled).toBeFalsy()
  })
  it('subscribes to data events (data enabled)', async () => {
    var spy = jest.spyOn(elements, 'resolveChildElementXAttributes')
    commonState.dataEnabled = true
    const page = await newSpecPage({
      components: [Elements],
      html: `<n-elements></n-elements>`,
    })
    await page.waitForChanges()

    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(spy).toHaveBeenCalled()

    page.root?.remove()
  })
  it('subscribes to data events (data enabled later)', async () => {
    var spy = jest.spyOn(elements, 'resolveChildElementXAttributes')
    commonState.dataEnabled = false
    const page = await newSpecPage({
      components: [Elements],
      html: `<n-elements></n-elements>`,
    })
    await page.waitForChanges()

    commonState.dataEnabled = true

    await page.waitForChanges()

    eventBus.emit(DATA_EVENTS.DataChanged, {})

    await page.waitForChanges()

    expect(spy).toHaveBeenCalled()

    page.root?.remove()
  })
})
