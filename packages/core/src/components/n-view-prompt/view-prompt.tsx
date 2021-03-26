import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'
import {
  ActionActivationStrategy,
  eventBus,
} from '../../services/actions'
import {
  commonState,
  debugIf,
  onCommonStateChange,
  slugify,
} from '../../services/common'
import { warn } from '../../services/common/logging'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveRemoteContent } from '../../services/content/remote'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { VisitStrategy } from '../../services/navigation/interfaces'
import { navigationState } from '../../services/navigation/state'
import { recordVisit } from '../../services/navigation/visits'
import { MatchResults } from '../../services/routing/interfaces'
import { Route } from '../../services/routing/route'
import { IViewDoTimer, ViewDoService } from './services'
import { ElementTimer } from './services/timer'

/**
 * This element represents a specialized child-route for a parent \<n-view\> component.
 * It represents a sub-route that has special presentation and workflow behaviors.
 *
 * They are used to create presentation, wizards, input workflows, or step by step instructions or
 * wherever you want guided or automatic navigation. These are the only routes that support
 * audio, video and timed actions.
 *
 * @system routing
 * @elements true
 *
 */
@Component({
  tag: 'n-view-prompt',
  styleUrl: 'view-prompt.css',
  shadow: true,
})
export class ViewPrompt {
  private dataSubscription!: () => void
  private route!: Route
  private service?: ViewDoService
  @Element() el!: HTMLNViewPromptElement
  @State() match: MatchResults | null = null
  @State() contentElement: HTMLElement | null = null
  private contentKey?: string | null

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
   * The url for this route, including the parent's
   * routes.
   *
   */
  @Prop({ mutable: true, reflect: true }) url!: string

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
   * When this value exists, the page will
   * automatically progress when the duration in seconds has passed.
   */
  @Prop() nextAfter?: number | boolean = false

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

  private get actionActivators(): HTMLNActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('n-action-activator'))
  }

  componentWillLoad() {
    debugIf(this.debug, `n-view-prompt: ${this.url} loading`)

    if (!navigationState.router) {
      warn(
        `n-view-prompt: ${this.url} cannot load outside of an n-views element`,
      )
      return
    }

    if (!this.parentView) {
      warn(
        `n-view-prompt: ${this.url} cannot load outside of an n-views element`,
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
    debugIf(this.debug, `n-view-prompt: ${this.url} will render`)

    if (this.match?.isExact) {
      debugIf(this.debug, `n-view-prompt: ${this.url} on-enter`)

      const autoNext = Boolean(this.nextAfter && this.nextAfter > 0)
      const duration = autoNext ? (this.nextAfter as number) : 0

      const timer: IViewDoTimer =
        this.el.querySelector('n-video')?.timer ||
        new ElementTimer(
          window,
          duration,
          performance.now(),
          this.debug,
        )

      this.service = new ViewDoService(
        this.el,
        timer,
        this.route,
        autoNext,
        this.debug,
      )
      this.contentElement =
        this.contentElement || (await this.resolveContentElement())
      if (this.contentElement && commonState.elementsEnabled)
        await this.service.captureChildElements(this.contentElement)

      await this.service.beginTimer()
      await recordVisit(this.visit as VisitStrategy, this.url)
    } else {
      this.service?.cleanup()
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
        `n-view-prompt: ${this.url} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
    }
  }

  render() {
    debugIf(this.debug, `n-view-prompt: ${this.url} render`)
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
    debugIf(this.debug, `n-view-prompt: ${this.url} did render`)
    if (commonState.actionsEnabled) {
      if (this.match?.isExact) {
        await this.route?.activateActions(
          this.actionActivators,
          ActionActivationStrategy.OnEnter,
        )
      } else if (this.route?.didExit()) {
        await this.route?.activateActions(
          this.actionActivators,
          ActionActivationStrategy.OnExit,
        )
      }
    }
    await this.route?.loadCompleted()
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.service?.cleanup?.call(this)
    this.route.destroy()
  }
}
