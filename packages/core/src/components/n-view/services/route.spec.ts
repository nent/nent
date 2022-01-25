jest.mock('../../../services/data/evaluate.worker')

import { RafCallback } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'
import {
  commonState,
  commonStateDispose
} from '../../../services/common'
import { EventEmitter } from '../../../services/common/emitter'
import { dataStateDispose } from '../../../services/data/state'
import { MatchResults } from '../../n-views/services/interfaces'
import { RouterService } from '../../n-views/services/router'
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
      0,
    )

    let subject = new Route(
      router,
      page.body,
      '/route',
      null,
      true,
      'Page',
      '',
      '',
      null,
      0,
      m => (match = m),
    )

    expect(subject).not.toBeNull()
    expect(match).toBeNull()

    subject.goToRoute('/route')

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
      'Page',
      'My page description',
      'desc, stuff',
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
      '{{route:product}}',
      '',
      '',
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
      'Page',
      '',
      '',
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

    expect(a.parentRoute).toBe(parent)
    expect(a.siblingIndex).toBe(0)

    expect(b.parentRoute).toBe(parent)
    expect(b.siblingIndex).toBe(1)

    expect(c.parentRoute).toBe(parent)
    expect(c.siblingIndex).toBe(2)

    expect(d.parentRoute).toBe(parent)
    expect(d.siblingIndex).toBe(3)

    expect(a.previousRoute?.path).toBe(parent.path)
    expect(a.nextRoute?.path).toBe(b.path)

    expect(b.previousRoute?.path).toBe(a.path)
    expect(b.nextRoute?.path).toBe(c.path)

    expect(c.previousRoute?.path).toBe(b.path)
    expect(c.nextRoute?.path).toBe(d.path)

    expect(d.previousRoute?.path).toBe(c.path)
    expect(d.nextRoute?.path).toBe(parent.path)

    router.destroy()
  })
})
