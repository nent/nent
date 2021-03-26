jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import {
  audioState,
  audioStateDispose,
} from '../n-audio/services/state'
import { AudioSwitch } from './audio-switch'

describe('n-audio-switch', () => {
  let storage: IDataProvider
  beforeEach(async () => {
    storage = new InMemoryProvider()
    addDataProvider('storage', storage)
  })

  afterEach(async () => {
    clearDataProviders()
    audioStateDispose()
  })

  it('audio:enabled', async () => {
    const page = await newSpecPage({
      components: [AudioSwitch],
      html: `<n-audio-switch></n-audio-switch>`,
    })
    expect(page.root).toEqualHtml(`
      <n-audio-switch>
        <input type="checkbox"  checked="">
      </n-audio-switch>
    `)

    audioState.enabled = false

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-audio-switch>
        <input type="checkbox">
      </n-audio-switch>
    `)

    const control = page.body.querySelector('input')
    control!.checked = true
    control!.dispatchEvent(new CustomEvent('change'))

    expect(page.root).toEqualHtml(`
      <n-audio-switch>
        <input type="checkbox"  checked="">
      </n-audio-switch>
    `)

    audioState.enabled = false

    let value = await storage.get('audio-enabled')

    expect(value).toBe('false')

    audioState.enabled = true

    value = await storage.get('audio-enabled')

    expect(value).toBe('true')

    page.body.querySelector('n-audio-switch')?.remove()
  })

  it('audio:muted', async () => {
    const page = await newSpecPage({
      components: [AudioSwitch],
      html: `<n-audio-switch setting="muted"></n-audio-switch>`,
    })
    expect(page.root).toEqualHtml(`
      <n-audio-switch setting="muted">
        <input type="checkbox">
      </n-audio-switch>
    `)

    audioState.muted = true

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-audio-switch setting="muted">
        <input type="checkbox" checked="">
      </n-audio-switch>
    `)

    const control = page.body.querySelector('input')
    control!.checked = false
    control!.dispatchEvent(new CustomEvent('change'))

    expect(page.root).toEqualHtml(`
      <n-audio-switch setting="muted">
        <input type="checkbox">
      </n-audio-switch>
    `)

    audioState.muted = true

    let value = await storage.get('audio-muted')

    expect(value).toBe('true')

    audioState.muted = false

    value = await storage.get('audio-muted')

    expect(value).toBe('false')

    page.body.querySelector('n-audio-switch')?.remove()
  })
})
