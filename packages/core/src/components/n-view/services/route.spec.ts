jest.mock('../../../services/data/evaluate.worker')

import { RafCallback } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'
import {
  commonState,
  commonStateDispose,
} from '../../../services/common'
import { EventEmitter } from '../../../services/common/emitter'
import { dataStateDispose } from '../../../services/data/state'
import { MatchResults } from '../../n-views/services/interfaces'
import { RouterService } from '../../n-views/services/router'
import { routingStateDispose } from '../../n-views/services/state'
import { Route } from './route'

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
    commonState.dataEnabled = true
    actionBus = new EventEmitter()
    eventBus = new EventEmitter()
  })

  afterEach(() => {
    dataStateDispose()
    commonStateDispose()
    routingStateDispose()
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
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
      'Router',
      '',
      '',
      '',
      0,
    )

    let subject = new Route(
      router,
      page.body,
      '/route',
      null,
      true,
      {
        title: 'Page',
      },
      null,
      0,
      m => (match = m),
    )

    expect(subject).not.toBeNull()
    expect(match).toBeNull()

    router.goToRoute('/route')

    await page.waitForChanges()

    await subject.loadCompleted()

    subject.captureInnerLinksAndResolveHtml(page.body)
    await page.waitForChanges()
    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('n-attached-click')).not.toBeNull()

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
    let subject = new Route(router, page.body, '/route')

    let normalized = subject.normalizeChildUrl('child')
    expect(normalized).toBe('/route/child')

    normalized = subject.normalizeChildUrl('/child')
    expect(normalized).toBe('/child')
  })

  it('adjustPageTags', async () => {
    page = await startPage('/')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'Router',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(
      router,
      routeElement,
      '/route',
      null,
      true,
      {
        title: 'Page',
        description: 'My page description',
        keywords: 'desc, stuff',
      },
      null,
      0,
      () => {},
    )

    await subject.adjustPageTags()

    await page.waitForChanges()

    expect(page.doc.title).toBe('Page | Router')
  })

  it('adjustPageTags - dynamic', async () => {
    page = await startPage('/route/Widget')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'Router',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(
      router,
      routeElement,
      '/route/:product',
      null,
      true,
      { title: '{{route:product}}' },
      null,
      0,
      () => {},
    )

    await subject.adjustPageTags()

    await page.waitForChanges()

    expect(page.doc.title).toBe('Widget | Router')
  })

  it('adjustPageTags - no page', async () => {
    page = await startPage('/route')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'Router',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(router, routeElement, '/route')

    subject.adjustPageTags()

    await page.waitForChanges()

    expect(page.doc.title).toBe('Router')
  })

  it('loadComplete - match', async () => {
    page = await startPage('/route')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      '',
      'Router',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(router, routeElement, '/route')

    subject.match = {
      path: '/route',
      isExact: true,
      params: {},
      url: '/route',
    }

    await subject.loadCompleted()

    expect(page.doc.title).toBe('Router')
  })

  it('loadComplete - scroll-top', async () => {
    page = await startPage('/route')
    router = new RouterService(
      page.win,
      writeTask,
      eventBus,
      actionBus,
      undefined,
      'Neat!',
    )
    const routeElement = page.body.querySelector('div')!
    let subject = new Route(
      router,
      routeElement,
      '/route',
      null,
      true,
      { title: 'Page' },
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
    let subject = new Route(router, routeElement, '/route')

    subject.captureInnerLinksAndResolveHtml()

    let anchor = page.body.querySelector('a')

    expect(anchor?.getAttribute('n-attached-click')).not.toBeNull()

    anchor?.click()

    subject.destroy()
  })

  it('parent, next and back routes', async () => {
    page = await newSpecPage({
      components: [],
      html: `<div id="parent">
        <div id="a"></div>
        <div id="b"></div>
        <div id="c"></div>
        <div id="d"></div>
      </div>`,
    })
    router = new RouterService(
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
    const routeElement = page.body.querySelector(
      'div#parent',
    ) as HTMLElement

    let parent = new Route(router, routeElement, '/route')

    let a = new Route(
      router,
      routeElement.querySelector('#a') as HTMLElement,
      '/a',
      parent,
    )

    let b = new Route(
      router,
      routeElement.querySelector('#b') as HTMLElement,
      '/b',
      parent,
    )

    let c = new Route(
      router,
      routeElement.querySelector('#c') as HTMLElement,
      '/c',
      parent,
    )

    let d = new Route(
      router,
      routeElement.querySelector('#d') as HTMLElement,
      '/d',
      parent,
    )

    const routes = parent.childRoutes
    expect(a.parentRoute).toBe(parent)
    expect(a.getSiblingIndex(routes)).toBe(0)

    expect(b.parentRoute).toBe(parent)
    expect(b.getSiblingIndex(routes)).toBe(1)

    expect(c.parentRoute).toBe(parent)
    expect(c.getSiblingIndex(routes)).toBe(2)

    expect(d.parentRoute).toBe(parent)
    expect(d.getSiblingIndex(routes)).toBe(3)

    expect((await a.getPreviousRoute())?.path).toBe(parent.path)
    expect((await a.getNextRoute())?.path).toBe(b.path)

    expect((await b.getPreviousRoute())?.path).toBe(a.path)
    expect((await b.getNextRoute())?.path).toBe(c.path)

    expect((await c.getPreviousRoute())?.path).toBe(b.path)
    expect((await c.getNextRoute())?.path).toBe(d.path)

    expect((await d.getPreviousRoute())?.path).toBe(c.path)
    expect((await d.getNextRoute())?.path).toBe(parent.path)

    router.destroy()
  })
})
