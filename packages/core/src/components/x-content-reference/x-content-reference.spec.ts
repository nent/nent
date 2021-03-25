jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { hasReference } from '../../services/content/references'
import { contentStateReset } from '../../services/content/state'
import { XContentReference } from './x-content-reference'

describe('x-content-reference', () => {
  afterEach(() => {
    contentStateReset()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference inline defer-load></x-content-reference>`,
    })
    expect(page.root).toEqualHtml(`
      <x-content-reference inline defer-load>
      </x-content-reference>
    `)
  })

  it('renders inline script', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference script-src="https://foo.js" inline timeout="300"></x-content-reference>`,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('x-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <x-content-reference script-src="https://foo.js" inline  timeout="300"><script src="https://foo.js"></script>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.js')).toBeTruthy()

    subject.remove()
  })

  it('renders inline styles', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference style-src="https://foo.css" inline timeout="300"></x-content-reference>`,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector('x-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <x-content-reference style-src="https://foo.css" inline="" timeout="300">
        <link href="https://foo.css" rel="stylesheet"/>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.css')).toBeTruthy()
  })

  it('renders module scripts', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `
       <x-content-reference inline  timeout="300" module script-src="https://foo.jsm"></x-content-reference>
      `,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('x-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <x-content-reference inline=""  timeout="300" module="" script-src="https://foo.jsm">
        <script type="module" src="https://foo.jsm"></script>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.jsm')).toBeTruthy()
  })

  it('renders no-module scripts', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `
       <x-content-reference inline  timeout="300" no-module script-src="https://foo.jsm"></x-content-reference>
      `,
    })

    let event
    page.body.addEventListener('onReferenced', ev => {
      event = ev
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('x-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <x-content-reference inline="" timeout="300" no-module="" script-src="https://foo.jsm">
        <script nomodule="" src="https://foo.jsm"></script>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.jsm')).toBeTruthy()
  })

  it('prevents duplicates styles', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `
      <x-content-reference style-src="https://foo.css" inline  timeout="300"></x-content-reference>
      <x-content-reference style-src="https://foo.css" inline  timeout="300"></x-content-reference>`,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('x-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <x-content-reference style-src="https://foo.css" inline=""  timeout="300">
        <link href="https://foo.css" rel="stylesheet">
      </x-content-reference>
    `)

    expect(hasReference('https://foo.css')).toBeTruthy()
  })
})
