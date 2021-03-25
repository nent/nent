jest.mock('../data/evaluate.worker')

import { RafCallback } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'
import { commonStateDispose } from '../common'
import { EventEmitter } from '../common/emitter'
import { dataState, dataStateDispose } from '../data/state'
import { MatchResults } from './interfaces'
import { Route } from './route'
import { RouterService } from './router'

describe('route', () => {
  let actionBus: EventEmitter
  let eventBus: EventEmitter
  let router: RouterService
  let page: SpecPage
  const writeTask: (func: RafCallback) => void = _func => {}

  const startPage = async (url: string = '') => {
    return await newSpecPage({
      components: [],
      html: `<div style="margin-top:1000px"><a name="test" href="/home"><h1>Test Header</h1></a></div>`,
      url: 'http://localhost' + url,
    })
  }

  beforeEach(async () => {
    dataState.enabled = true
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  afterEach(() => {
    dataStateDispose()
    commonStateDispose()
  })

  it('router-service -> create-route', async () => {
    page = await startPage('/')
    let match: MatchResults | null = null

    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'App',
      '',
      0,
    )

    let subject = router.createRoute(
      page.body,
      '/route',
      true,
      'Page',
      null,
      0,
      m => (match = m),
    )

    expect(subject).not.toBeNull()
    expect(subject.match).toBeNull()

    subject.goToRoute('/route')

    await page.waitForChanges()

    await subject.loadCompleted()

    subject.captureInnerLinks(page.body)
    await page.waitForChanges()
    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('x-attached-click')).not.toBeNull()

    anchor?.click()

    subject.destroy()

    // expect(match).not.toBeNull()
  })

  it('normalizeChildUrl', async () => {
    page = await startPage('/')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )
    let subject = new Route(eventBus, router, page.body, '/route')

    let normalized = subject.normalizeChildUrl('child')
    expect(normalized).toBe('/route/child')

    normalized = subject.normalizeChildUrl('/child')
    expect(normalized).toBe('/child')
  })

  it('adjustPageTitle', async () => {
    page = await startPage('/')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'App',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = router.createRoute(
      routeElement,
      '/route',
      true,
      'Page',
      null,
      0,
      () => {},
    )

    await subject.adjustTitle()

    await page.waitForChanges()

    expect(page.doc.title).toBe('Page | App')
  })

  it('adjustPageTitle - dynamic', async () => {
    page = await startPage('/route/Widget')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'App',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = router.createRoute(
      routeElement,
      '/route/:product',
      true,
      '{{route:product}}',
      null,
      0,
      () => {},
    )

    await subject.adjustTitle()

    await page.waitForChanges()

    expect(page.doc.title).toBe('Widget | App')
  })

  it('adjustPageTitle - no page', async () => {
    page = await startPage('/route')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'App',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(eventBus, router, routeElement, '/route')

    subject.adjustTitle()

    await page.waitForChanges()

    expect(page.doc.title).toBe('App')
  })

  it('loadComplete - match', async () => {
    page = await startPage('/route')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'App',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(eventBus, router, routeElement, '/route')

    subject.match = {
      path: '/route',
      isExact: true,
      params: {},
      url: '/route',
    }

    await subject.loadCompleted()

    expect(page.doc.title).toBe('App')
  })

  it('loadComplete - scroll-top', async () => {
    page = await startPage('/route')
    page.doc.title = 'Neat!'
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(
      eventBus,
      router,
      routeElement,
      '/route',
      true,
      'Page',
      null,
      10,
    )

    subject.match = {
      path: '/route',
      isExact: true,
      params: {},
      url: '/route',
    }

    routeElement.scrollIntoView = jest.fn()
    page.win.scrollTo = jest.fn()

    await subject.loadCompleted()

    //expect(routeElement.scrollIntoView).toBeCalled()
    //expect(page.win.scrollTo).toBeCalled()

    expect(page.doc.title).toBe('Page | Neat!')
  })

  it('captureInnerLinks', async () => {
    page = await startPage('/')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(eventBus, router, routeElement, '/route')

    subject.captureInnerLinks()

    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('x-attached-click')).not.toBeNull()

    anchor?.click()

    subject.destroy()
  })
})
