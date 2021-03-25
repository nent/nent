jest.mock('../../services/common/logging')
jest.mock('./audio/track')
jest.mock('./audio/actions')
import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import { contentStateDispose } from '../../services/content/state'
import { XContentReference } from '../x-content-reference/x-content-reference'
import { AudioActionListener } from './audio/actions'
import { audioState, audioStateDispose } from './audio/state'
import { XAudio } from './x-audio'

describe('x-audio', () => {
  beforeEach(() => {
    audioState.enabled = true
  })

  afterEach(async () => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    contentStateDispose()
    audioStateDispose()
  })

  it('no display, no error', async () => {
    const page = await newSpecPage({
      components: [XAudio, XContentReference],
      html: `<x-audio></x-audio>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-audio hidden="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
      </mock:shadow-root>
    </x-audio>
    `)

    page.root?.remove()
  })

  it('display, no error', async () => {
    const page = await newSpecPage({
      components: [XAudio, XContentReference],
      html: `<x-audio display></x-audio>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-audio display="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    page.root?.remove()
  })

  it('display, audio disabled', async () => {
    audioState.enabled = false
    const page = await newSpecPage({
      components: [XAudio, XContentReference],
      html: `<x-audio display></x-audio>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <x-audio display="">
      <mock:shadow-root>
        <div>
          <p>
            Audio Disabled
          </p>
          <button>
            Enable
          </button>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    const enableBtn = page.root?.shadowRoot?.querySelector('button')
    enableBtn?.click()

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <x-audio display="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    page.root?.remove()
  })

  it('display, error: duplicate', async () => {
    const page = await newSpecPage({
      components: [XAudio, XContentReference],
      html: `<x-audio></x-audio>`,
    })

    await page.waitForChanges()

    expect(page.body).toEqualHtml(`
    <x-audio hidden="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
      </mock:shadow-root>
    </x-audio>
    `)

    const subject = page.root?.shadowRoot?.querySelector(
      'x-content-reference',
    )!
    await subject.forceLoad()

    const audio2 = page.doc.createElement('x-audio')
    audio2.display = true
    page.body.appendChild(audio2)

    await page.waitForChanges()

    expect(page.body).toEqualHtml(`
    <x-audio hidden="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
      </mock:shadow-root>
    </x-audio>
    <x-audio>
      <mock:shadow-root>
        <div>
          <p class="error">
            Duplicate Audio Player
          </p>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    page.body.querySelectorAll('x-audio').forEach(a => a.remove())
  })

  it('reacts to audioState changes', async () => {
    const page = await newSpecPage({
      components: [XAudio, XContentReference],
      html: `<x-audio display></x-audio>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-audio display="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    audioState.enabled = false

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-audio display="">
      <mock:shadow-root>
        <div>
          <p>
            Audio Disabled
          </p>
          <button>
            Enable
          </button>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    page.root?.remove()
  })

  it('display, audio loaded', async () => {
    const page = await newSpecPage({
      components: [XAudio, XContentReference],
      html: `<x-audio display></x-audio>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <x-audio display="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    const subject = page.root?.shadowRoot?.querySelector(
      'x-content-reference',
    )!
    await subject.forceLoad()

    const actions = page.body.querySelector('x-audio')!
      .actions! as AudioActionListener

    actions.play()

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <x-audio display="">
      <mock:shadow-root>
        <x-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </x-content-reference>
        <div>
          <p>
            Audio Playing
          </p>
          <span title="m=music s=sound l=loaded q=queued">
            M:0&nbsp;MQ:0&nbsp;ML:0&nbsp;S:0&nbsp;SL:0
          </span>
        </div>
      </mock:shadow-root>
    </x-audio>
    `)

    page.root?.remove()
  })
})
