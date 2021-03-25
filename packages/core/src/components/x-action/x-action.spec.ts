jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, EventAction } from '../../services/actions'
import { XAction } from './x-action'

describe('x-action', () => {
  afterAll(() => {
    actionBus.removeAllListeners()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action></x-action>`,
    })
    expect(page.root).toEqualHtml(
      `<x-action>
       </x-action>`,
    )
  })

  it('x-action: getAction missing topic', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action></x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action>
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).toBeNull()
  })

  it('x-action: getAction missing command', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="navigation"></x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action topic="navigation">
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).toBeNull()
  })

  it('x-action: getAction no data', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="navigation" command="go-to"></x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action topic="navigation" command="go-to">
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()
  })

  it('x-action: sendAction', async () => {
    let msg: EventAction<any> | null = null
    actionBus.on('navigation', (a: any) => {
      msg = a
    })
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="navigation" command="go-to"></x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action topic="navigation" command="go-to">
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()

    action?.sendAction({
      url: '/test',
    })

    await page.waitForChanges()

    expect(msg).not.toBeUndefined()
  })

  it('x-action: getAction param data', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="navigation" command="go-to" data-name="Bill"></x-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()
    expect(event?.command).toBe('go-to')
    expect(event?.data.name).toBe('Bill')
  })

  it('x-action: data from script', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="test" command="feed-me">
              <script>{ "name": "willy" }</script>
             </x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action topic="test" command="feed-me">
        <script>{ "name": "willy" }</script>
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()

    expect(event?.topic).toBe('test')
    expect(event?.command).toBe('feed-me')
    expect(event?.data.name).toBe('willy')
  })

  it('x-action: data from empty script', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="test" command="feed-me">
              <script></script>
             </x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action topic="test" command="feed-me">
        <script></script>
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()

    expect(event?.topic).toBe('test')
    expect(event?.command).toBe('feed-me')
  })

  it('x-action: getAction data from input', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="navigation" command="go-to">
              <input type="text" name="username" value="user1"/>
              <input type="text" id="email" value="u@foo.com"/>
              <input type="text" value="3"/>
            </x-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action!.getAction()

    expect(event).not.toBeNull()
    expect(event!.data).not.toBeNull()
    expect(event!.data!.username).not.toBeNull()
    expect(event!.data!.username).toBe('user1')
    expect(event!.data!.email).toBe('u@foo.com')
    expect(event!.data!['2']).toBe('3')
  })

  it('x-action: getAction data from hidden input', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="navigation" command="go-to">
              <input type="hidden" id="username" value="user1"/>
            </x-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action!.getAction()

    expect(event).not.toBeNull()
    expect(event!.data).not.toBeNull()
    expect(event!.data!.username).not.toBeNull()
    expect(event!.data!.username).toBe('user1')
  })

  it('x-action: getAction data from checkbox', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="navigation" command="go-to">
              <input type="checkbox" id="agree" />
            </x-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action!.getAction()

    expect(event).not.toBeNull()
    expect(event!.data).not.toBeNull()
    expect(event!.data!.agree).not.toBeNull()
    expect(event!.data!.agree).toBe(false)
  })
})
