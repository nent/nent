import { newSpecPage } from '@stencil/core/testing'
import { appState, appStateDispose } from '../n-app/app/state'
import { AppTheme } from './app-theme'

describe('n-app-theme', () => {
  beforeEach(() => {
    appStateDispose()
  })

  it('renders with light preset', async () => {
    const page = await newSpecPage({
      components: [AppTheme],
    })
    page.setContent(`<n-app-theme></n-app-theme>`)
    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)
    const subject = page.body.querySelector('n-app-theme')
    subject?.remove()
  })

  it('renders with dark preset', async () => {
    const page = await newSpecPage({
      components: [AppTheme],
    })
    appState.theme = 'dark'
    page.setContent(`<n-app-theme></n-app-theme>`)
    await page.waitForChanges()
    expect(page.body.classList.contains('dark')).toBe(true)
    const subject = page.body.querySelector('n-app-theme')
    subject?.remove()
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

    if (componentListener) {
      componentListener({
        matches: false,
      })
    }

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)
    const subject = page.body.querySelector('n-app-theme')
    subject?.remove()
  })
})
