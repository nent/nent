import { newSpecPage } from '@stencil/core/testing'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers'
import { videoState } from '../x-video/video'
import { XAppAutoplay } from './x-video-autoplay-switch'
describe('x-video-autoplay-switch', () => {
  let storage: IDataProvider
  beforeEach(async () => {
    storage = new InMemoryProvider()
    addDataProvider('storage', storage)
  })

  afterEach(async () => {
    clearDataProviders()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAppAutoplay],
      html: `<x-video-autoplay-switch></x-video-autoplay-switch>`,
    })
    expect(page.root).toEqualHtml(`
      <x-video-autoplay-switch>
        <input checked="" type="checkbox">
      </x-video-autoplay-switch>
    `)

    videoState.autoplay = true

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-video-autoplay-switch>
        <input type="checkbox" checked="">
      </x-video-autoplay-switch>
    `)

    const control = page.body.querySelector('input')
    control!.checked = false
    control!.dispatchEvent(new CustomEvent('change'))

    expect(page.root).toEqualHtml(`
      <x-video-autoplay-switch>
        <input type="checkbox" >
      </x-video-autoplay-switch>
    `)

    let value = await storage.get('autoplay')

    expect(value).toBe('false')

    videoState.autoplay = true

    value = await storage.get('autoplay')

    expect(value).toBe('true')

    page.body.querySelector('x-video-autoplay-switch')?.remove()
  })
})
