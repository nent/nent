jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  clearDataProviders,
  getDataProvider,
  removeDataProvider,
} from '../../services/data/factory'
import { dataStateDispose } from '../../services/data/state'
import { XAction } from '../x-action/x-action'
import { XData } from '../x-data/x-data'
import { CookieService } from './cookie/service'
import { XDataProviderCookie } from './x-data-provider-cookie'

describe('x-data-provider-cookie', () => {
  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    clearDataProviders()
    dataStateDispose()
  })

  it('no render when hide', async () => {
    const page = await newSpecPage({
      components: [XDataProviderCookie],
      html: `<x-data-provider-cookie skip-consent>
          </x-data-provider-cookie>`,
      supportsShadowDom: true,
    })
    expect(page.root).toEqualHtml(`
    <x-data-provider-cookie hidden="" skip-consent>
      <mock:shadow-root>
            <slot></slot>
            <a id="accept">
              <slot name="accept">
                Accept
              </slot>
            </a>
            <a id="reject">
              <slot name="reject">
                Reject
              </slot>
            </a>
          </mock:shadow-root>
    </x-data-provider-cookie>
    `)
  })

  it('renders a dialog, click consent', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderCookie],
      html: `
        <x-data>
          <x-data-provider-cookie>
            <button slot="accept">Accept</button>
            <button slot="reject">Reject</button>
          </x-data-provider-cookie>
        </x-data>`,
    })

    const subject = page.body.querySelector('x-data-provider-cookie')

    const acceptButton = subject!.shadowRoot!.querySelector(
      'a#accept',
    ) as HTMLAnchorElement
    expect(acceptButton).not.toBeNull()
    acceptButton.click()

    await subject?.registerProvider()
    await page.waitForChanges()

    const provider = await getDataProvider('cookie')
    expect(provider).not.toBeNull()

    let value = await provider!.get('consent')

    expect(value).toBe('true')

    subject?.remove()
    page.body.querySelector('x-data')!.remove()
  })

  it('renders a dialog, click reject', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderCookie],
      html: `
        <x-data>
          <x-data-provider-cookie>
            <button slot="accept">Accept</button>
            <button slot="reject">Reject</button>
          </x-data-provider-cookie>
        </x-data>`,
      supportsShadowDom: true,
    })

    const subject = page.body.querySelector('x-data-provider-cookie')!

    const rejectButton = subject!.shadowRoot!.querySelector(
      'a#reject',
    ) as HTMLAnchorElement

    rejectButton.click()

    await page.waitForChanges()

    const provider = await getDataProvider('cookie')
    expect(provider).toBeNull()

    subject?.remove()
    page.body.querySelector('x-data')!.remove()
  })

  it('responds to set-data commands', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderCookie],
      html:
        '<x-data><x-data-provider-cookie></x-data-provider-cookie></x-data>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('x-data-provider-cookie')!
    await subject.registerProvider()
    const provider = (await getDataProvider(
      'cookie',
    )) as CookieService
    expect(provider).toBeDefined()

    const action = new XAction()
    action.topic = 'cookie'
    action.command = 'set-data'
    await action.sendAction({ test: 'value' })

    let result = await provider.get('test')
    expect(result).toBe('value')

    subject.remove()
  })

  it('remembers consent', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderCookie],
      html:
        '<x-data><x-data-provider-cookie></x-data-provider-cookie></x-data>',
      supportsShadowDom: true,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('x-data-provider-cookie')!
    await subject.registerProvider()
    let provider = (await getDataProvider('cookie')) as CookieService
    expect(provider).toBeDefined()

    removeDataProvider('cookie')

    const action = new XAction()
    action.topic = 'cookie'
    action.command = 'set-data'
    await action.sendAction({ consent: 'true' })

    page.setContent(
      '<x-data><x-data-provider-cookie></x-data-provider-cookie></x-data>',
    )

    expect(page.root).toEqualHtml(`
      <x-data>
        <mock:shadow-root></mock:shadow-root>
        <x-data-provider-cookie>
          <mock:shadow-root></mock:shadow-root>
        </x-data-provider-cookie>
      </x-data>
    `)

    provider = (await getDataProvider('cookie')) as CookieService

    let result = await provider.get('consent')
    expect(result).toBe('true')

    expect(provider).not.toBeNull()
  })
})
