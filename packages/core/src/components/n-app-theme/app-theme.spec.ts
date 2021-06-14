import { newSpecPage } from '@stencil/core/testing'
import { appState, appStateDispose } from '../n-app/services/state'
import { AppTheme } from './app-theme'

describe('n-app-theme', () => {
  afterEach(() => {
    appStateDispose()
  })

  it('renders with light preset', async () => {
    const page = await newSpecPage({
      components: [AppTheme],
      html: `<n-app-theme></n-app-theme>`,
    })
    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)
    page.root!.remove()
  })

  it('renders with dark state preset', async () => {
    const page = await newSpecPage({
      components: [AppTheme],
    })
    appState.darkMode = true
    page.setContent(`<n-app-theme></n-app-theme>`)
    await page.waitForChanges()
    expect(page.body.classList.contains('dark')).toBe(true)
    page.root!.remove()
  })

  it('renders with light state preset', async () => {
    const page = await newSpecPage({
      components: [AppTheme],
    })
    appState.darkMode = false
    page.setContent(`<n-app-theme></n-app-theme>`)
    await page.waitForChanges()
    expect(page.body.classList.contains('dark')).toBe(false)
    page.root!.remove()
  })

  it('renders with dark media', async () => {
    const page = await newSpecPage({
      components: [AppTheme],
    })

    let componentListener: any
    const mediaChanged = (_type: any, listener: any) => {
      componentListener = listener
    }

    const inner = page.win.matchMedia
    const replaced = (query: string) => {
      const results = inner(query)
      return {
        ...results,
        matches: true,
        addEventListener: mediaChanged,
      }
    }

    page.win.matchMedia = replaced

    page.setContent(`<n-app-theme></n-app-theme>`)

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(true)

    page.root!.remove()
  })

  it('renders with a switch to dark media', async () => {
    const page = await newSpecPage({
      components: [AppTheme],
    })

    let componentListener: any
    const mediaChanged = (_type: any, listener: any) => {
      componentListener = listener
    }

    const inner = page.win.matchMedia
    const replaced = (query: string) => {
      const results = inner(query)
      return {
        ...results,
        matches: false,
        addEventListener: mediaChanged,
      }
    }

    page.win.matchMedia = replaced

    page.setContent(`<n-app-theme></n-app-theme>`)

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)

    if (componentListener) {
      componentListener({
        matches: true,
      })
    }

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(true)
    page.root!.remove()
  })
})
