import { newSpecPage } from '@stencil/core/testing'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { IDataProvider } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import { videoState } from '../n-video/services/state'
import { VideoSwitch } from './video-switch'

describe('n-video-switch', () => {
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
      components: [VideoSwitch],
      html: `<n-video-switch></n-video-switch>`,
    })
    expect(page.root).toEqualHtml(`
      <n-video-switch>
        <input checked="" type="checkbox">
      </n-video-switch>
    `)

    videoState.autoplay = true

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-video-switch>
        <input type="checkbox" checked="">
      </n-video-switch>
    `)

    const control = page.body.querySelector('input')
    control!.checked = false
    control!.dispatchEvent(new CustomEvent('change'))

    expect(page.root).toEqualHtml(`
      <n-video-switch>
        <input type="checkbox" >
      </n-video-switch>
    `)

    let value = await storage.get('autoplay')

    expect(value).toBe('false')

    videoState.autoplay = true

    value = await storage.get('autoplay')

    expect(value).toBe('true')

    page.body.querySelector('n-video-switch')?.remove()
  })
})
