jest.mock('../../../services/data/evaluate.worker')

import { EventEmitter } from '../../../services/common'
import { NavigationActionListener } from './actions'
import { NAVIGATION_COMMANDS, NAVIGATION_TOPIC } from './interfaces'
import { RouterService } from './router'

describe('actions:', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let subject: NavigationActionListener
  let mockRouter: RouterService
  beforeEach(() => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
    mockRouter = jest.fn<RouterService>(() => {
      return {
        goBack: jest.fn(),
        goToParentRoute: jest.fn(),
        goToRoute: jest.fn(),
      }
    })() as RouterService

    subject = new NavigationActionListener(
      mockRouter,
      eventBus,
      actionBus,
    )
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })
  it('go-to', async () => {
    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goTo,
      data: {
        path: '/home',
      },
    })
    expect(mockRouter.goToRoute).toBeCalledWith('/home')
  })

  it('go-back', async () => {
    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goBack,
    })
    expect(mockRouter.goBack).toBeCalled()
  })

  it('go-next', async () => {
    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goNext,
    })
    expect(mockRouter.goToParentRoute).toBeCalled()
  })
})
