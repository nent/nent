jest.mock('../data/evaluate.worker')

import { eventBus } from '../actions'
import { ComponentRefresher } from './refresher'

describe('ComponentRefresher', () => {
  it('ComponentRefresher-destroy', () => {
    afterEach(() => {
      eventBus.removeAllListeners()
    })
    // Arguments
    const component = {}
    const eventName1 = 'Oha'

    // todo

    // Method call
    const componentRefresher = new ComponentRefresher(
      component,
      eventBus,
      'debug',
      eventName1,
    )

    componentRefresher.destroy()
  })
})
