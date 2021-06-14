import { newSpecPage } from '@stencil/core/testing'
import { appState, appStateDispose } from '../n-app/services/state'
import { AppThemeSwitch } from './app-theme-switch'

describe('n-app-theme-switch', () => {
  afterEach(() => {
    appStateDispose()
  })

  it('checkbox shows accurate state: null', async () => {
    appState.darkMode = null
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      autoApplyChanges: true,
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })

    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
        <input id="dark-mode" type="checkbox" indeterminate=""/>
      </n-app-theme-switch>
    `)

    page.root!.remove()
  })

  it('checkbox shows accurate state: dark', async () => {
    appState.darkMode = true
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
        <input id="dark-mode" checked="" type="checkbox">
      </n-app-theme-switch>
    `)
    page.root!.remove()
  })

  it('checkbox shows accurate state: light', async () => {
    appState.darkMode = false
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
        <input id="dark-mode" type="checkbox">
      </n-app-theme-switch>
    `)

    page.root!.remove()
  })

  it('checkbox click changes theme', async () => {
    appState.darkMode = true
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
       <input id="dark-mode" checked="" type="checkbox"/>
      </n-app-theme-switch>
    `)

    const control = page.body.querySelector('n-app-theme-switch')
    const input = control?.querySelector('input')
    input!.checked = false
    input!.dispatchEvent(new CustomEvent('change'))

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <n-app-theme-switch>
      <input id="dark-mode" type="checkbox"/>
     </n-app-theme-switch>
    `)

    expect(appState.darkMode).toBe(false)

    input!.checked = true
    input!.dispatchEvent(new CustomEvent('change'))

    await page.waitForChanges()

    expect(appState.darkMode).toBe(true)

    page.root!.remove()
  })
})
