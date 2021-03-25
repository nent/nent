jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import { getDataProvider } from '../../services/data/factory'
import { dataStateDispose } from '../../services/data/state'
import { XAction } from '../x-action/x-action'
import { XData } from '../x-data/x-data'
import { SessionService } from './session/service'
import { XDataProviderSession } from './x-data-provider-session'

describe('x-data-provider-session', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XDataProviderSession],
      html: `<x-data-provider-session></x-data-provider-session>`,
    })
    expect(page.root).toEqualHtml(`
      <x-data-provider-session>
      </x-data-provider-session>
    `)
  })

  it('registers the provider and it works', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderSession],
      html: `<x-data>
        <x-data-provider-session></x-data-provider-session>
      </x-data>`,
      supportsShadowDom: true,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector(
      'x-data-provider-session',
    )!

    const provider = (await getDataProvider(
      'session',
    )) as SessionService
    expect(provider).not.toBeNull()

    await provider!.set('test', 'value')

    const result = page.win.sessionStorage.getItem('test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)

    subject.remove()
  })

  it('can be aliased', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderSession],
      html: `<x-data>
              <x-data-provider-session
                name="sissy"
                key-prefix="d:">
              </x-data-provider-session>
            </x-data>`,
      supportsShadowDom: true,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector(
      'x-data-provider-session',
    )!

    const provider = (await getDataProvider(
      'sissy',
    )) as SessionService
    expect(provider).not.toBeNull()

    await provider!.set('test', 'value')

    const result = page.win.sessionStorage.getItem('d:test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)

    subject.remove()
  })

  it('responds to set-data commands', async () => {
    const page = await newSpecPage({
      components: [XData, XDataProviderSession],
      html: `<x-data>
        <x-data-provider-session></x-data-provider-session>
      </x-data>`,
      supportsShadowDom: true,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector(
      'x-data-provider-session',
    )!

    const provider = (await getDataProvider(
      'session',
    )) as SessionService
    expect(provider).not.toBeNull()

    const action = new XAction()
    action.topic = 'session'
    action.command = 'set-data'
    await action.sendAction({ test: 'value' })

    const result = page.win.sessionStorage.getItem('test')
    expect(result).toBe('value')

    const verified = await provider!.get('test')
    expect(verified).toBe(result)

    subject.remove()
  })
})
