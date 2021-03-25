jest.mock('../data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { HistoryService } from './history'
import { LocationSegments } from './interfaces'

describe('history', () => {
  const startPage = async (url: string = '') => {
    const page = await newSpecPage({
      components: [],
      html: `<div></div>`,
      url: 'http://localhost' + url,
    })

    return page
  }

  beforeEach(async () => {})

  it('initialize: browser / ', async () => {
    const page = await startPage()
    const subject = new HistoryService(page.win, '')
    expect(subject.location).not.toBeNull()
    expect(subject.location.pathname).toBe('/')
    subject.destroy()
  })

  it('initialize: browser /home ', async () => {
    const page = await startPage('/home')
    const subject = new HistoryService(page.win, '')
    expect(subject.location).not.toBeNull()
    expect(subject.location.pathname).toBe('/home')
    subject.destroy()
  })

  it('initialize: browser @base/home ', async () => {
    const page = await startPage('/@base/home')

    const subject = new HistoryService(page.win, '/@base')
    expect(subject.location).not.toBeNull()
    expect(subject.location.pathname).toBe('/home')

    let currentLocation: LocationSegments
    subject.listen(location => {
      currentLocation = location
    })
    expect(currentLocation!).toBe(subject.location)

    let href = subject.createHref(subject.location)
    expect(href).toBe('/@base/home')

    subject.push('/about')
    expect(subject.location.pathname).toBe('/about')
    expect(currentLocation!.pathname).toBe('/about')

    subject.replace('/replaced')
    expect(subject.location.pathname).toBe('/replaced')
    expect(currentLocation!.pathname).toBe('/replaced')
    subject.destroy()
  })
})
