jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { commonStateDispose } from '../../services/common'
import { Elements } from '../n-elements/elements'
import {
  navigationState,
  navigationStateDispose,
} from './services/state'
import { ViewRouter } from './views'

describe('n-views', () => {
  afterEach(() => {
    commonStateDispose()
    navigationStateDispose()
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    jest.resetAllMocks()
  })

  it('navigates to the start page', async () => {
    const page = await newSpecPage({
      components: [ViewRouter],
      url: 'http://hello.com/',
      html: `<n-views start-path='/home'>
       <h1>Hello</h1>
     </n-views>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <n-views start-path='/home'>
    <h1>
      Hello
    </h1>
  </n-views>`)

    const app = page.body.querySelector('n-views')
    expect(app).not.toBeUndefined()
    const router = navigationState?.router

    expect(router).not.toBeUndefined()

    expect(router!.history.location.pathname).toBe('/home')
    expect(router!.location.pathname).toBe('/home')

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })

  it('navigates to the start page, with root', async () => {
    const page = await newSpecPage({
      components: [ViewRouter],
      url: 'http://hello.com/hello',
      html: `<n-views start-path='/home' root="/hello">
       <h1>Hello</h1>
     </n-views>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <n-views start-path='/home' root="/hello">
    <h1>
      Hello
    </h1>
  </n-views>`)

    const router = navigationState?.router

    expect(router!.history.location.pathname).toBe('/home')

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })

  it('navigates to the start page, with root & hash', async () => {
    const page = await newSpecPage({
      components: [ViewRouter],
      url: 'http://hello.com/hello',
      html: `<n-views hash start-path='/home' root="/hello">
       <h1>Hello</h1>
     </n-views>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <n-views hash start-path='/home' root="/hello">
    <h1>
      Hello
    </h1>
  </n-views>`)

    const router = navigationState?.router

    expect(router!.history.location.pathname).toBe('/home')

    expect(page.win!.location.pathname).toBe('/hello')

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })

  it('navigates to the start page, with root & file extension', async () => {
    const page = await newSpecPage({
      components: [ViewRouter],
      url: 'http://hello.com/path/hello.html',
      html: `<n-views start-path='/home' root="/path/hello.html">
       <h1>Hello</h1>
     </n-views>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
  <n-views start-path='/home' root="/path/hello.html">
    <h1>
      Hello
    </h1>
  </n-views>`)

    const router = navigationState?.router

    expect(router!.history.location.pathname).toBe('/home')

    expect(page.win!.location.pathname).toBe('/path/hello.html')

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })

  it('renders and displays cloaked content', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, Elements],
      html: `<n-views app-title="Hello">
              <n-elements><div></div></n-elements>
              <div n-cloak></div>
            </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <n-views app-title="Hello">
        <n-elements>
        <div></div>
        </n-elements>
        <div></div>
      </n-views>
    `)

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })

  it('adds hidden to n-hide children', async () => {
    const page = await newSpecPage({
      components: [ViewRouter, Elements],
      html: `<n-views app-title="Hello" debug>
              <n-elements>
              <div></div>
              </n-elements>
              <div n-hide></div>
            </n-views>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <n-views app-title="Hello" debug>
      <n-elements>
      <div></div>
      </n-elements>
      <div hidden></div>
    </n-views>
  `)

    const subject = page.body.querySelector('n-views')
    subject?.remove()
  })
})
