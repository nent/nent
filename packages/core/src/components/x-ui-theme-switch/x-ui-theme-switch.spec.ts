import { newSpecPage } from '@stencil/core/testing'
import { uiState, uiStateDispose } from '../x-ui/ui'
import { XUIThemeSwitch } from './x-ui-theme-switch'

describe('x-ui-theme-switch', () => {
  beforeEach(() => {
    uiStateDispose()
  })

  it('checkbox shows accurate state: null', async () => {
    uiState.theme = null
    const page = await newSpecPage({
      components: [XUIThemeSwitch],
      autoApplyChanges: true,
      html: `<x-ui-theme-switch></x-ui-theme-switch>`,
    })

    expect(page.root).toEqualHtml(`
      <x-ui-theme-switch>
        <input type="checkbox"/>
      </x-ui-theme-switch>
    `)

    const subject = page.body.querySelector('x-ui-theme-switch')
    subject?.remove()
  })

  it('checkbox shows accurate state: dark', async () => {
    uiState.theme = 'dark'
    const page = await newSpecPage({
      components: [XUIThemeSwitch],
      html: `<x-ui-theme-switch></x-ui-theme-switch>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-ui-theme-switch>
        <input checked="" type="checkbox">
      </x-ui-theme-switch>
    `)
    const subject = page.body.querySelector('x-ui-theme-switch')
    subject?.remove()
  })

  it('checkbox shows accurate state: light', async () => {
    uiState.theme = 'light'
    const page = await newSpecPage({
      components: [XUIThemeSwitch],
      html: `<x-ui-theme-switch></x-ui-theme-switch>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-ui-theme-switch>
        <input type="checkbox">
      </x-ui-theme-switch>
    `)

    const subject = page.body.querySelector('x-ui-theme-switch')
    subject?.remove()
  })

  it('checkbox click changes theme', async () => {
    uiState.theme = 'dark'
    const page = await newSpecPage({
      components: [XUIThemeSwitch],
      html: `<x-ui-theme-switch></x-ui-theme-switch>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui-theme-switch>
       <input checked="" type="checkbox"/>
      </x-ui-theme-switch>
    `)

    const control = page.body.querySelector('x-ui-theme-switch')
    const input = control?.querySelector('input')
    input!.checked = true
    input!.dispatchEvent(new CustomEvent('change'))

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <x-ui-theme-switch>
      <input type="checkbox"/>
     </x-ui-theme-switch>
    `)

    expect(uiState.theme).not.toEqual('dark')

    const subject = page.body.querySelector('x-ui-theme-switch')
    subject?.remove()
  })
})
