import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import { slugify } from '../../services/common'
import { debugIf, warn } from '../../services/common/logging'
import {
  commonState,
  onCommonStateChange,
} from '../../services/common/state'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveRemoteContent } from '../../services/content/remote'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { IView, VisitStrategy } from '../n-view/services/interfaces'
import { Route } from '../n-view/services/route'
import { recordVisit } from '../n-view/services/visits'
import { MatchResults } from '../n-views/services/interfaces'
import { navigationState } from '../n-views/services/state'

/**
 * This element represents a specialized child-route for a parent \<n-view\> component.
 * It represents a sub-route that has required and workflow behaviors.
 *
 * They are used to create, wizards, input workflows, or step by step instructions or
 * wherever you want guided or automatic navigation.
 *
 * @system routing
 * @extension data
 * @extension elements
 */
@Component({
  tag: 'n-view-prompt',
  styleUrl: 'view-prompt.css',
  shadow: true,
})
export class ViewPrompt implements IView {
  private dataSubscription!: () => void

  @Element() el!: HTMLNViewPromptElement
  @State() match: MatchResults | null = null
  @State() contentElement: HTMLElement | null = null
  private contentKey?: string | null

  /** Route information */
  @Prop({ mutable: true }) route!: Route

  /**
   * The title for this view. This is prefixed
   * before the app title configured in n-views
   *
   */
  @Prop() pageTitle = ''

  /**
   * Header height or offset for scroll-top on this
   * view.
   */
  @Prop() scrollTopOffset?: number

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * The path for this prompt route, including the parent's
   * routes, excluding the router's root.
   */
  @Prop({ mutable: true, reflect: true }) path!: string

  /**
   * The url for this route should only be matched
   * when it is exact.
   */
  @Prop() exact: boolean = true

  /**
   * The visit strategy for this do.
   * once: persist the visit and never force it again
   * always: do not persist, but don't don't show again in-session
   * optional: do not force this view-do ever. It will be available by URL
   */
  @Prop() visit: 'once' | 'always' | 'optional' = 'once'

  /**
   * If present, the expression must
   * evaluate to true for this route
   * to be sequenced by the parent view.
   * The existence of this value overrides
   * the visit strategy
   */
  @Prop() when?: string

  /**
   * Remote URL for HTML content. Content from this
   * URL will be assigned the 'content' slot.
   */
  @Prop() contentSrc?: string

  /**
   * Cross Origin Mode if the content is pulled from
   * a remote location
   */
  @Prop() mode: 'cors' | 'navigate' | 'no-cors' | 'same-origin' =
    'cors'

  /**
   * Before rendering remote HTML, replace any data-tokens with their
   * resolved values. This also commands this component to
   * re-render it's HTML for data-changes. This can affect
   * performance.
   *
   * IMPORTANT: ONLY WORKS ON REMOTE HTML
   */
  @Prop() resolveTokens: boolean = false

  /**
   * To debug timed elements, set this value to true.
   */
  @Prop() debug = false

  private get parentView() {
    return this.el.closest('n-view')
  }

  componentWillLoad() {
    debugIf(this.debug, `n-view-prompt: ${this.path} loading`)

    if (!navigationState.router) {
      warn(
        `n-view-prompt: ${this.path} cannot load outside of an n-views element`,
      )
      return
    }

    if (!this.parentView) {
      warn(
        `n-view-prompt: ${this.path} cannot load outside of an n-views element`,
      )
      return
    }

    this.route = navigationState.router.createRoute(
      this.el,
      this.parentView,
      (match: MatchResults | null) => {
        this.match = match ? { ...match } : null
      },
    )

    if (commonState.dataEnabled) {
      this.subscribeToDataEvents()
    } else {
      const dataSubscription = onCommonStateChange(
        'dataEnabled',
        enabled => {
          if (enabled) {
            this.subscribeToDataEvents()
            dataSubscription()
          }
        },
      )
    }

    this.contentKey = `rem-content-${slugify(
      this.contentSrc || 'none',
    )}`
  }

  private subscribeToDataEvents() {
    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      async () => {
        debugIf(this.debug, 'n-view-prompt: data changed ')
        if (this.match?.isExact)
          await resolveChildElementXAttributes(this.el)
      },
    )
  }

  async componentWillRender() {
    debugIf(this.debug, `n-view-prompt: ${this.path} will render`)

    if (this.match?.isExact) {
      debugIf(this.debug, `n-view-prompt: ${this.path} on-enter`)
      this.contentElement = await this.resolveContentElement()
      await recordVisit(this.visit as VisitStrategy, this.path)
    } else {
      this.contentElement?.remove()
    }
  }

  private async resolveContentElement() {
    if (!this.contentSrc) {
      return null
    }

    try {
      const content = await resolveRemoteContent(
        window,
        this.contentSrc!,
        this.mode,
        this.resolveTokens,
      )
      if (content == null) return null

      const div = window.document.createElement('div')
      div.slot = 'content'
      div.innerHTML = content
      div.id = this.contentKey!
      if (commonState.elementsEnabled)
        await resolveChildElementXAttributes(div)
      this.route.captureInnerLinks(div)
      return div
    } catch {
      warn(
        `n-view-prompt: ${this.path} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
    }
  }

  render() {
    debugIf(this.debug, `n-view-prompt: ${this.path} render`)
    replaceHtmlInElement(
      this.el,
      `#${this.contentKey}`,
      this.contentElement,
    )
    return (
      <Host hidden={!this.match?.isExact}>
        <slot />
        <slot name="content" />
      </Host>
    )
  }

  async componentDidRender() {
    await this.route?.loadCompleted()
    if (!this.route?.match?.isExact) {
      this.contentElement?.remove()
      this.contentElement = null
    }
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.route?.destroy()
  }
}
