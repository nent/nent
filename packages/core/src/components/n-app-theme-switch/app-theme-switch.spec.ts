import { newSpecPage } from '@stencil/core/testing'
import { appState, appStateDispose } from '../n-app/services/state'
import { AppThemeSwitch } from './app-theme-switch'

describe('n-app-theme-switch', () => {
  beforeEach(() => {
    appStateDispose()
  })

  it('checkbox shows accurate state: null', async () => {
    appState.theme = null
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      autoApplyChanges: true,
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })

    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
        <input type="checkbox"/>
      </n-app-theme-switch>
    `)

    const subject = page.body.querySelector('n-app-theme-switch')
    subject?.remove()
  })

  it('checkbox shows accurate state: dark', async () => {
    appState.theme = 'dark'
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
        <input checked="" type="checkbox">
      </n-app-theme-switch>
    `)
    const subject = page.body.querySelector('n-app-theme-switch')
    subject?.remove()
  })

  it('checkbox shows accurate state: light', async () => {
    appState.theme = 'light'
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
        <input type="checkbox">
      </n-app-theme-switch>
    `)

    const subject = page.body.querySelector('n-app-theme-switch')
    subject?.remove()
  })

  it('checkbox click changes theme', async () => {
    appState.theme = 'dark'
    const page = await newSpecPage({
      components: [AppThemeSwitch],
      html: `<n-app-theme-switch></n-app-theme-switch>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-app-theme-switch>
       <input checked="" type="checkbox"/>
      </n-app-theme-switch>
    `)

    const control = page.body.querySelector('n-app-theme-switch')
    const input = control?.querySelector('input')
    input!.checked = true
    input!.dispatchEvent(new CustomEvent('change'))

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <n-app-theme-switch>
      <input type="checkbox"/>
     </n-app-theme-switch>
    `)

    expect(appState.theme).not.toEqual('dark')

    const subject = page.body.querySelector('n-app-theme-switch')
    subject?.remove()
  })
})
