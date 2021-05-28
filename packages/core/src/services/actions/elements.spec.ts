jest.mock('../../services/common/logging')
import { sendActions } from './elements'
import { IActionElement } from './interfaces'
describe('elements', () => {
  test('sendActions: happy path', async () => {
    let sendActionWasCalled = false
    const action: IActionElement = {
      command: '',
      topic: '',
      getAction: async () => {
        return null
      },
      sendAction: async (data?: any) => {
        sendActionWasCalled = true
      },
    }

    await sendActions([action])

    expect(sendActionWasCalled).toBeTruthy()
  })
})
