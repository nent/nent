jest.mock('../../services/common/logging')
jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/data/jsonata.worker')
jest.mock('./services/track')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  commonState,
  commonStateDispose,
} from '../../services/common'
import { contentStateDispose } from '../../services/content/state'
import { dataStateDispose } from '../../services/data/state'
import { App } from '../n-app/app'
import { ContentReference } from '../n-content-reference/content-reference'
import { ContentTemplate } from '../n-content-template/content-template'
import { Data } from '../n-data/data'
import { Audio } from './audio'
import { AudioActionListener } from './services/actions'
import {
  AudioType,
  AUDIO_COMMANDS,
  AUDIO_TOPIC,
  DiscardStrategy,
  LoadStrategy,
} from './services/interfaces'
import { audioStateDispose } from './services/state'

describe('n-audio', () => {
  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    audioStateDispose()
    contentStateDispose()
    dataStateDispose()
    commonStateDispose()
  })

  it('no display, no error', async () => {
    const page = await newSpecPage({
      components: [Audio, ContentReference],
      html: `<n-audio></n-audio>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-audio hidden="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
      </mock:shadow-root>
    </n-audio>
    `)

    page.root!.remove()
  })

  it('display, no error', async () => {
    const page = await newSpecPage({
      components: [Audio, ContentReference],
      html: `<n-audio display></n-audio>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-audio display="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </n-audio>
    `)

    page.root?.remove()
  })

  it('display, audio disabled', async () => {
    commonState.audioEnabled = false
    const page = await newSpecPage({
      components: [Audio, ContentReference],
      html: `<n-audio display></n-audio>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <n-audio display="">
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
    </n-audio>
    `)

    const enableBtn = page.root?.shadowRoot?.querySelector('button')
    enableBtn?.click()

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <n-audio display="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </n-audio>
    `)

    page.root?.remove()
  })

  it('display, error: duplicate', async () => {
    const page = await newSpecPage({
      components: [Audio, ContentReference],
      html: `<n-audio></n-audio>`,
    })

    await page.waitForChanges()

    expect(page.body).toEqualHtml(`
    <n-audio hidden="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
      </mock:shadow-root>
    </n-audio>
    `)

    const subject = page.root?.shadowRoot?.querySelector(
      'n-content-reference',
    )!
    await subject.forceLoad()

    const audio2 = page.doc.createElement('n-audio')
    audio2.display = true
    page.body.appendChild(audio2)

    await page.waitForChanges()

    expect(page.body).toEqualHtml(`
    <n-audio hidden="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
      </mock:shadow-root>
    </n-audio>
    <n-audio>
      <mock:shadow-root>
        <div>
          <p class="error">
            Duplicate Audio Player
          </p>
        </div>
      </mock:shadow-root>
    </n-audio>
    `)

    page.body.querySelectorAll('n-audio').forEach(a => a.remove())
  })

  it('reacts to audioState changes', async () => {
    const page = await newSpecPage({
      components: [Audio, ContentReference],
      html: `<n-audio display></n-audio>`,
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-audio display="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </n-audio>
    `)

    commonState.audioEnabled = false

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-audio display="">
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
    </n-audio>
    `)

    page.root?.remove()
  })

  it('display, audio loaded', async () => {
    const page = await newSpecPage({
      components: [Audio, ContentReference],
      html: `<n-audio display></n-audio>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
    <n-audio display="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
        <div>
          <p>
            No Audio
          </p>
        </div>
      </mock:shadow-root>
    </n-audio>
    `)

    const ref = page.root?.shadowRoot?.querySelector(
      'n-content-reference',
    )! as any
    await ref.forceLoad()

    await page.waitForChanges()

    const listener = page.root?.actions as AudioActionListener

    expect(listener).toBeDefined()

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.load,
      data: {
        src: 'fake.mp3',
        mode: LoadStrategy.load,
        type: AudioType.music,
        discard: DiscardStrategy.next,
        trackId: 'test',
        loop: false,
      },
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
    <n-audio display="">
      <mock:shadow-root>
        <n-content-reference script-src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js">
          <script src="https://cdn.jsdelivr.net/npm/howler@2.2.1/dist/howler.core.min.js"></script>
        </n-content-reference>
        <div>
          <p>
            Audio Ready
          </p>
          <span title="m=music s=sound l=loaded q=queued">
            M:0&nbsp;MQ:0&nbsp;ML:1&nbsp;S:0&nbsp;SL:0
          </span>
        </div>
      </mock:shadow-root>
    </n-audio>
    `)

    page.root?.remove()
  })

  it('display, audio loaded - data-enabled', async () => {
    const page = await newSpecPage({
      components: [
        App,
        Data,
        Audio,
        ContentReference,
        ContentTemplate,
      ],
    })
    page.win.localStorage.setItem('audio-enabled', 'true')

    await page.setContent(`
    <n-app>
      <n-data></n-data>
      <n-audio data-provider></n-audio>
      <n-content-template>
        <template>
          <p id="hasAudio">{{audio:hasAudio}}</p>
        </template>
      </n-content-template>
    </n-app>`)

    expect(commonState.dataEnabled).toBeTruthy()
    expect(commonState.audioEnabled).toBeTruthy()

    await page.waitForChanges()

    const audio = page.body.querySelector(
      'n-audio',
    ) as HTMLNAudioElement
    expect(audio).toBeDefined()
    expect(audio.dataProvider).toBeTruthy()

    const contentRef = audio?.shadowRoot?.querySelector(
      'n-content-reference',
    )! as HTMLNContentReferenceElement
    await contentRef.forceLoad()

    await page.waitForChanges()
    const listener = audio.actions as AudioActionListener

    expect(listener).toBeDefined()
    expect(listener.provider).toBeDefined()

    let subject = page.body.querySelector('#hasAudio')

    expect(subject?.innerHTML).toEqualHtml(`false`)

    actionBus.emit(AUDIO_TOPIC, {
      command: AUDIO_COMMANDS.play,
      data: {
        src: 'fake.mp3',
        mode: LoadStrategy.play,
        type: AudioType.music,
        discard: DiscardStrategy.next,
        trackId: 'test',
        loop: false,
      },
    })

    await page.waitForChanges()

    subject = page.body.querySelector('#hasAudio')

    // TODO: figure out why this doesn't work
    //expect(subject?.innerHTML).toEqualHtml(`true`)

    page.root?.remove()
  })
})
