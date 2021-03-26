jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, EventAction } from '../../services/actions'
import { Action } from './action'

describe('n-action', () => {
  afterAll(() => {
    actionBus.removeAllListeners()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action></n-action>`,
    })
    expect(page.root).toEqualHtml(
      `<n-action>
       </n-action>`,
    )
  })

  it('n-action: getAction missing topic', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action></n-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<n-action>
       </n-action>`,
    )

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).toBeNull()
  })

  it('n-action: getAction missing command', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="navigation"></n-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<n-action topic="navigation">
       </n-action>`,
    )

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).toBeNull()
  })

  it('n-action: getAction no data', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="navigation" command="go-to"></n-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<n-action topic="navigation" command="go-to">
       </n-action>`,
    )

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()
  })

  it('n-action: sendAction', async () => {
    let msg: EventAction<any> | null = null
    actionBus.on('navigation', (a: any) => {
      msg = a
    })
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="navigation" command="go-to"></n-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<n-action topic="navigation" command="go-to">
       </n-action>`,
    )

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()

    action?.sendAction({
      url: '/test',
    })

    await page.waitForChanges()

    expect(msg).not.toBeUndefined()
  })

  it('n-action: getAction param data', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="navigation" command="go-to" data-name="Bill"></n-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()
    expect(event?.command).toBe('go-to')
    expect(event?.data.name).toBe('Bill')
  })

  it('n-action: data from script', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="test" command="feed-me">
              <script>{ "name": "willy" }</script>
             </n-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<n-action topic="test" command="feed-me">
        <script>{ "name": "willy" }</script>
       </n-action>`,
    )

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()

    expect(event?.topic).toBe('test')
    expect(event?.command).toBe('feed-me')
    expect(event?.data.name).toBe('willy')
  })

  it('n-action: data from empty script', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="test" command="feed-me">
              <script></script>
             </n-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<n-action topic="test" command="feed-me">
        <script></script>
       </n-action>`,
    )

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()

    expect(event?.topic).toBe('test')
    expect(event?.command).toBe('feed-me')
  })

  it('n-action: getAction data from input', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="navigation" command="go-to">
              <input type="text" name="username" value="user1"/>
              <input type="text" id="email" value="u@foo.com"/>
              <input type="text" value="3"/>
            </n-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action!.getAction()

    expect(event).not.toBeNull()
    expect(event!.data).not.toBeNull()
    expect(event!.data!.username).not.toBeNull()
    expect(event!.data!.username).toBe('user1')
    expect(event!.data!.email).toBe('u@foo.com')
    expect(event!.data!['2']).toBe('3')
  })

  it('n-action: getAction data from hidden input', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="navigation" command="go-to">
              <input type="hidden" id="username" value="user1"/>
            </n-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action!.getAction()

    expect(event).not.toBeNull()
    expect(event!.data).not.toBeNull()
    expect(event!.data!.username).not.toBeNull()
    expect(event!.data!.username).toBe('user1')
  })

  it('n-action: getAction data from checkbox', async () => {
    const page = await newSpecPage({
      components: [Action],
      html: `<n-action topic="navigation" command="go-to">
              <input type="checkbox" id="agree" />
            </n-action>`,
      supportsShadowDom: false,
    })

    const action = page.body.querySelector('n-action')

    expect(action).not.toBeNull()

    const event = await action!.getAction()

    expect(event).not.toBeNull()
    expect(event!.data).not.toBeNull()
    expect(event!.data!.agree).not.toBeNull()
    expect(event!.data!.agree).toBe(false)
  })
})
