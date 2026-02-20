jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { hasReference } from '../../services/content/references'
import { contentStateReset } from '../../services/content/state'
import { ContentReference } from './content-reference'

describe('n-content-reference', () => {
  afterEach(() => {
    contentStateReset()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentReference],
      html: `<n-content-reference inline defer-load></n-content-reference>`,
    })
    expect(page.root).toEqualHtml(`
      <n-content-reference inline defer-load>
      </n-content-reference>
    `)
  })

  it('renders inline script', async () => {
    const page = await newSpecPage({
      components: [ContentReference],
      html: `<n-content-reference script-src="https://foo.js" inline timeout="300"></n-content-reference>`,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('n-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <n-content-reference script-src="https://foo.js" inline  timeout="300"><script src="https://foo.js"></script>
      </n-content-reference>
    `)

    expect(await hasReference('https://foo.js')).toBeTruthy()

    subject.remove()
  })

  it('renders inline styles', async () => {
    const page = await newSpecPage({
      components: [ContentReference],
      html: `<n-content-reference style-src="https://foo.css" inline timeout="300"></n-content-reference>`,
    })

    await page.waitForChanges()

    const subject = page.body.querySelector('n-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <n-content-reference style-src="https://foo.css" inline="" timeout="300">
        <link href="https://foo.css" rel="stylesheet"/>
      </n-content-reference>
    `)

    expect(await hasReference('https://foo.css')).toBeTruthy()
  })

  it('renders module scripts', async () => {
    const page = await newSpecPage({
      components: [ContentReference],
      html: `
       <n-content-reference inline  timeout="300" module script-src="https://foo.jsm"></n-content-reference>
      `,
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('n-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <n-content-reference inline=""  timeout="300" module="" script-src="https://foo.jsm">
        <script type="module" src="https://foo.jsm"></script>
      </n-content-reference>
    `)

    expect(await hasReference('https://foo.jsm')).toBeTruthy()
  })

  it('renders no-module scripts', async () => {
    const page = await newSpecPage({
      components: [ContentReference],
      html: `
       <n-content-reference inline  timeout="300" no-module script-src="https://foo.jsm"></n-content-reference>
      `,
    })

    page.body.addEventListener('onReferenced', ev => {
      event = ev
    })
    await page.waitForChanges()

    const subject = page.body.querySelector('n-content-reference')!
    await subject.forceLoad()

    expect(page.root).toEqualHtml(`
      <n-content-reference inline="" timeout="300" no-module="" script-src="https://foo.jsm">
        <script nomodule="" src="https://foo.jsm"></script>
      </n-content-reference>
    `)

    expect(await hasReference('https://foo.jsm')).toBeTruthy()
  })

  it('prevents duplicates styles', async () => {
    const page = await newSpecPage({
      components: [ContentReference],
      html: `
      <n-content-reference style-src="https://foo.css" inline module timeout="300"></n-content-reference>
      <n-content-reference style-src="https://foo.css" inline module timeout="300"></n-content-reference>
      `,
    })
    await page.waitForChanges()

    const subjects = page.body.querySelectorAll('n-content-reference')

    for (const s of Array.from(subjects)) {
      await s.forceLoad()
    }
    await page.waitForChanges()

    expect(subjects[0]).toEqualHtml(`
      <n-content-reference style-src="https://foo.css" inline="" module=""  timeout="300">
        <link href="https://foo.css" rel="stylesheet">
      </n-content-reference>
    `)

    expect(subjects[1]).toEqualHtml(`
      <n-content-reference style-src="https://foo.css" inline="" module=""  timeout="300">\
      </n-content-reference>
    `)

    expect(await hasReference('https://foo.css')).toBeTruthy()
  })
})
