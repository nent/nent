import { newSpecPage } from '@stencil/core/testing'
import { uiState, uiStateDispose } from '../x-ui/ui'
import { XUITheme } from './x-ui-theme'

describe('x-ui-theme', () => {
  beforeEach(() => {
    uiStateDispose()
  })

  it('renders with light preset', async () => {
    const page = await newSpecPage({
      components: [XUITheme],
    })
    page.setContent(`<x-ui-theme></x-ui-theme>`)
    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)
    const subject = page.body.querySelector('x-ui-theme')
    subject?.remove()
  })

  it('renders with dark preset', async () => {
    const page = await newSpecPage({
      components: [XUITheme],
    })
    uiState.theme = 'dark'
    page.setContent(`<x-ui-theme></x-ui-theme>`)
    await page.waitForChanges()
    expect(page.body.classList.contains('dark')).toBe(true)
    const subject = page.body.querySelector('x-ui-theme')
    subject?.remove()
  })

  it('renders with dark media', async () => {
    const page = await newSpecPage({
      components: [XUITheme],
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

    page.setContent(`<x-ui-theme></x-ui-theme>`)

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(true)

    if (componentListener) {
      componentListener({
        matches: false,
      })
    }

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)
    const subject = page.body.querySelector('x-ui-theme')
    subject?.remove()
  })
})
