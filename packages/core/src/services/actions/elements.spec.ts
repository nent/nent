jest.mock('../../services/common/logging')

import { sendActions } from './elements'
import { IActionElement } from './interfaces'
describe('elements', () => {
  test('sendActions: happy path', async () => {
    let sendActionWasCalled = false
    const action = {
      command: '',
      topic: '',
      when: '',
      getAction: async () => {
        return null
      },
      sendAction: async (_data?: any) => {
        sendActionWasCalled = true
      },
      valid: false,
      childScript: null,
    }

    await sendActions([action as IActionElement])

    expect(sendActionWasCalled).toBeTruthy()
  })
})
