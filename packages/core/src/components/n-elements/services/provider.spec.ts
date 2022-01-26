jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { resolveTokens } from '../../..'
import { EventEmitter } from '../../../services/common'
import { App } from '../../n-app/app'
import { Data } from '../../n-data/data'
import { Elements } from '../elements'

describe('elements-provider:', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter

  beforeAll(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  afterAll(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('element-get-data ', async () => {
    const page = await newSpecPage({
      components: [App, Elements, Data],
      html: `<n-app>
              <n-data></n-data>
              <input id="test" value="1"/>
              <n-elements><n-elements>
            </n-app>`,
      autoApplyChanges: true,
    })

    await page.waitForChanges()

    const value = await resolveTokens('{{elements:test}}', false)
    expect(value).toBe('1')
  })
})
