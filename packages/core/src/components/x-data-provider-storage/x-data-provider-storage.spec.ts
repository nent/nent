jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import { getDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { dataStateDispose } from '../../services/data/state'
import { XAction } from '../x-action/x-action'
import { XData } from '../x-data/x-data'
import { StorageService } from './storage/service'
import { XDataProviderStorage } from './x-data-provider-storage'

describe('x-data-provider-storage', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProviderStorage],
      html: `<x-data-provider-storage></x-data-provider-storage>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data-provider-storage>
      </x-data-provider-storage>
    `)
  })

  it('registers a provider', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderStorage],
      html:
        '<x-data><x-data-provider-storage></x-data-provider-storage></x-data>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector(
      'x-data-provider-storage',
    )!

    const provider = (await getDataProvider(
      'storage',
    )) as StorageService
    expect(provider).toBeDefined()

    await provider!.set('test', 'value')

    const result = page.win.localStorage.getItem('test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)

    let changed = false
    eventBus.on(DATA_EVENTS.DataChanged, () => {
      changed = true
    })

    page.win.dispatchEvent(new CustomEvent('storage'))
    page.win.localStorage.setItem('fake', 'value')

    await page.waitForChanges()

    expect(changed).toBeTruthy()

    subject.remove()
  })

  it('can be aliased', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderStorage],
      html: `<x-data>
              <x-data-provider-storage
                name="puffy"
                key-prefix="g:">
              </x-data-provider-storage>
            </x-data>`,
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector(
      'x-data-provider-storage',
    )!

    const provider = (await getDataProvider(
      'puffy',
    )) as StorageService
    expect(provider).toBeDefined()

    await provider!.set('test', 'value')

    const result = page.win.localStorage.getItem('g:test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)

    let changed = false
    eventBus.on(DATA_EVENTS.DataChanged, () => {
      changed = true
    })

    page.win.dispatchEvent(new CustomEvent('storage'))
    page.win.localStorage.setItem('fake', 'value')

    await page.waitForChanges()

    expect(changed).toBeTruthy()

    subject.remove()
  })

  it('responds to set-data commands', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderStorage],
      html:
        '<x-data><x-data-provider-storage></x-data-provider-storage></x-data>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector(
      'x-data-provider-storage',
    )!

    const provider = (await getDataProvider(
      'storage',
    )) as StorageService
    expect(provider).toBeDefined()

    const action = new XAction()
    action.topic = 'storage'
    action.command = 'set-data'
    await action.sendAction({ test: 'value' })

    const result = page.win.localStorage.getItem('test')
    expect(result).toBe('value')

    subject.remove()
  })
})
