jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { audioState, audioStateDispose } from '../x-audio/audio/state'
import { XAudioEnabled } from './x-audio-state-switch'

describe('x-audio-state-switch', () => {
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
      components: [XAudioEnabled],
      html: `<x-audio-state-switch></x-audio-state-switch>`,
    })
    expect(page.root).toEqualHtml(`
      <x-audio-state-switch>
        <input type="checkbox"  checked="">
      </x-audio-state-switch>
    `)

    audioState.enabled = false

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-audio-state-switch>
        <input type="checkbox">
      </x-audio-state-switch>
    `)

    const control = page.body.querySelector('input')
    control!.checked = true
    control!.dispatchEvent(new CustomEvent('change'))

    expect(page.root).toEqualHtml(`
      <x-audio-state-switch>
        <input type="checkbox"  checked="">
      </x-audio-state-switch>
    `)

    audioState.enabled = false

    let value = await storage.get('audio-enabled')

    expect(value).toBe('false')

    audioState.enabled = true

    value = await storage.get('audio-enabled')

    expect(value).toBe('true')

    page.body.querySelector('x-audio-state-switch')?.remove()
  })

  it('audio:muted', async () => {
    const page = await newSpecPage({
      components: [XAudioEnabled],
      html: `<x-audio-state-switch setting="muted"></x-audio-state-switch>`,
    })
    expect(page.root).toEqualHtml(`
      <x-audio-state-switch setting="muted">
        <input type="checkbox">
      </x-audio-state-switch>
    `)

    audioState.muted = true

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-audio-state-switch setting="muted">
        <input type="checkbox" checked="">
      </x-audio-state-switch>
    `)

    const control = page.body.querySelector('input')
    control!.checked = false
    control!.dispatchEvent(new CustomEvent('change'))

    expect(page.root).toEqualHtml(`
      <x-audio-state-switch setting="muted">
        <input type="checkbox">
      </x-audio-state-switch>
    `)

    audioState.muted = true

    let value = await storage.get('audio-muted')

    expect(value).toBe('true')

    audioState.muted = false

    value = await storage.get('audio-muted')

    expect(value).toBe('false')

    page.body.querySelector('x-audio-state-switch')?.remove()
  })
})
