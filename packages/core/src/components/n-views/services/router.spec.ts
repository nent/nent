jest.mock('../../../services/data/evaluate.worker')

import { RafCallback } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'
import { EventEmitter } from '../../../services/common/emitter'
import { NAVIGATION_COMMANDS, NAVIGATION_TOPIC } from './interfaces'
import { RouterService } from './router'

describe('router', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let innerFunc: RafCallback | null
  const writeTask = (func: RafCallback) => {
    innerFunc = func
  }

  const startPage = async (url: string = '') => {
    return await newSpecPage({
      components: [],
      html: `<div style="margin-top:3000px"><a name="test" href="/home"><h1>Test Header</h1></a></div>`,
      url: 'http://localhost' + url,
    })
  }

  beforeEach(async () => {
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    innerFunc = null
  })

  const testNormalize = (subject: RouterService) => {
    let normalized = subject.normalizeChildUrl('child', 'parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('/child', 'parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('child', '/parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('//child', '//parent')
    expect(normalized).toBe('/parent/child')

    normalized = subject.normalizeChildUrl('//child/', '//parent')
    expect(normalized).toBe('/parent/child/')

    normalized = subject.normalizeChildUrl('child/', 'parent/')
    expect(normalized).toBe('/parent/child/')
  }

  const testGoToPath = (subject: RouterService) => {
    subject.goToRoute('/home')
    expect(subject.location.pathname).toBe('/home')

    subject.goToRoute('home')
    expect(subject.location.pathname).toBe('/home')

    subject.goToRoute('home/page1')
    expect(subject.location.pathname).toBe('/home/page1')

    subject.goToParentRoute()
    expect(subject.location.pathname).toBe('/home')
  }

  const testMatch = (subject: RouterService) => {
    subject.goToRoute('home')

    let match = subject.matchPath({
      path: '/home',
      strict: true,
      exact: true,
    })

    expect(match).not.toBeNull()
    expect(match!.isExact).toBe(true)
    expect(match!.path).toBe('/home')
    expect(match!.url).toBe('/home')

    match = subject.matchPath({
      path: '/about',
    })

    expect(match).toBeNull()
  }

  it('initialized: blank path/', async () => {
    const page = await startPage()
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )

    expect(subject.location.pathname).toBe('/')

    testGoToPath(subject)
    testNormalize(subject)
    testMatch(subject)

    subject.destroy()
  })

  it('initialized: path = /home', async () => {
    const page = await startPage('/home')
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )

    expect(subject.location.pathname).toBe('/home')

    testGoToPath(subject)
    testNormalize(subject)
    testMatch(subject)

    subject.destroy()
  })

  it('match-path: browser | path = /item/:item ', async () => {
    const page = await startPage('/item/food')
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )

    expect(subject.location.pathname).toBe('/item/food')

    // @ts-ignore
    let results = subject.matchPath({
      path: '/item/:item',
    })

    expect(results).not.toBeNull()
    expect(results?.params.item).not.toBeNull()
    expect(results?.params.item).toBe('food')

    subject.destroy()
  })

  it('router-service: scrollTop ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )

    let didScroll = false

    page.win.onscroll = () => {
      didScroll = true
    }

    subject.routeCompleted()

    subject.scrollTo(0)
    subject.destroy()

    innerFunc!(1)

    // TODO: We need a way to detect page scrolls in this mock object
    //expect(didScroll).toBe(true)
  })

  it('router-service: captureInnerLinks ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )

    subject.captureInnerLinks(page.body)
    await page.waitForChanges()
    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('n-attached-click')).not.toBeNull()

    anchor?.click()

    subject.destroy()
  })

  it('actions: navigate-to, navigate-next ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goTo,
      data: {
        path: '/home',
      },
    })

    await page.waitForChanges()

    expect(subject.location.pathname).toBe('/home')

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goTo,
      data: {
        path: '/home/page1',
      },
    })

    await page.waitForChanges()

    expect(subject.location.pathname).toBe('/home/page1')

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goNext,
    })

    await page.waitForChanges()

    expect(subject.history.location.pathname).toBe('/home')
    expect(subject.location.pathname).toBe('/home')
  })

  it('actions: navigate-back ', async () => {
    const page = await startPage('/')
    const subject = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      '',
      '',
      '',
      '',
      0,
    )

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goTo,
      data: {
        url: '/page1',
      },
    })

    await page.waitForChanges()

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goTo,
      data: {
        path: '/page2',
      },
    })

    await page.waitForChanges()

    expect(subject.history.location.pathname).toBe('/page2')

    actionBus.emit(NAVIGATION_TOPIC, {
      topic: NAVIGATION_TOPIC,
      command: NAVIGATION_COMMANDS.goBack,
    })

    await page.waitForChanges()

    // TODO: I can't find a way to mock the history back...
    // expect(subject.history.location.pathname).toBe('/page1')
  })
})
