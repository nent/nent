jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import { getDataProvider } from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { dataStateDispose } from '../../services/data/state'
import { Action } from '../n-action/action'
import { Data } from '../n-data/data'
import { DataStorage } from './data-storage'
import { StorageService } from './services/storage'

describe('n-data-storage', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [DataStorage],
      html: `<n-data-storage></n-data-storage>`,
    })
    expect(page.root).toEqualHtml(`
      <n-data-storage>
      </n-data-storage>
    `)
  })

  it('registers a provider', async () => {
    const page = await newSpecPage({
      components: [Data, DataStorage],
      html: '<n-data><n-data-storage></n-data-storage></n-data>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('n-data-storage')!

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
      components: [Data, DataStorage],
      html: `<n-data>
              <n-data-storage
                name="puffy"
                key-prefix="g:">
              </n-data-storage>
            </n-data>`,
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('n-data-storage')!

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
      components: [Data, DataStorage],
      html: '<n-data><n-data-storage></n-data-storage></n-data>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('n-data-storage')!

    const provider = (await getDataProvider(
      'storage',
    )) as StorageService
    expect(provider).toBeDefined()

    const action = new Action()
    action.topic = 'storage'
    action.command = 'set-data'
    await action.sendAction({ test: 'value' })

    const result = page.win.localStorage.getItem('test')
    expect(result).toBe('value')

    subject.remove()
  })
})
