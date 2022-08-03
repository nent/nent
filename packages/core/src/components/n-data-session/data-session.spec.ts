jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { eventBus } from '../../services/actions'
import { getDataProvider } from '../../services/data/factory'
import { dataStateDispose } from '../../services/data/state'
import { Action } from '../n-action/action'
import { Data } from '../n-data/data'
import { DataSession } from './data-session'
import { SessionService } from './services/session'

describe('n-data-session', () => {
  afterEach(() => {
    eventBus.removeAllListeners()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [DataSession],
      html: `<n-data-session></n-data-session>`,
    })
    expect(page.root).toEqualHtml(`
      <n-data-session>
        <mock:shadow-root></mock:shadow-root>
      </n-data-session>
    `)
  })

  it('registers the provider and it works', async () => {
    const page = await newSpecPage({
      components: [Data, DataSession],
      html: `<n-data>
        <n-data-session></n-data-session>
      </n-data>`,
      supportsShadowDom: true,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector('n-data-session')!

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
      components: [Data, DataSession],
      html: `<n-data>
              <n-data-session
                name="sissy"
                key-prefix="d:">
              </n-data-session>
            </n-data>`,
      supportsShadowDom: true,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector('n-data-session')!

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
      components: [Data, DataSession],
      html: `<n-data>
        <n-data-session></n-data-session>
      </n-data>`,
      supportsShadowDom: true,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector('n-data-session')!

    const provider = (await getDataProvider(
      'session',
    )) as SessionService
    expect(provider).not.toBeNull()

    const action = new Action()
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
