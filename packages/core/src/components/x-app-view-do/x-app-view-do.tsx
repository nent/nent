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
import { debugIf, slugify } from '../../services/common'
import { warn } from '../../services/common/logging'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveRemoteContent } from '../../services/content/remote'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { VisitStrategy } from '../../services/navigation/interfaces'
import { recordVisit } from '../../services/navigation/visits'
import { MatchResults, Route } from '../../services/routing'
import { IViewDoTimer, ViewDoService } from './media'
import { ElementTimer } from './media/timer'
/**
 * This element represents a specialized child-route for a parent \<x-app-view\> component.
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
  tag: 'x-app-view-do',
  styleUrl: 'x-app-view-do.css',
  shadow: true,
})
export class XAppViewDo {
  private dataSubscription!: () => void
  private route!: Route
  private service?: ViewDoService
  @Element() el!: HTMLXAppViewDoElement
  @State() match: MatchResults | null = null
  @State() contentElement: HTMLElement | null = null
  private contentKey?: string | null

  /**
   * The title for this view. This is prefixed
   * before the app title configured in x-app
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
    return this.el.closest('x-app-view')
  }

  private get routeContainer() {
    return this.el.closest('x-app')
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(this.el.querySelectorAll('x-action-activator'))
  }

  componentWillLoad() {
    debugIf(this.debug, `x-app-view-do: ${this.url} loading`)

    if (!this.routeContainer) {
      warn(
        `x-app-view-do: ${this.url} cannot load outside of an x-app element`,
      )
      return
    }

    if (!this.parentView) {
      warn(
        `x-app-view-do: ${this.url} cannot load outside of an x-app element`,
      )
      return
    }

    this.route = this.routeContainer.router.createRoute(
      this.el,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || this.parentView.transition || null,
      this.scrollTopOffset || 0,
      (match: MatchResults | null) => {
        this.match = match ? { ...match } : null
      },
    )

    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      async () => {
        debugIf(this.debug, 'x-app-view-do: data changed ')
        if (this.match?.isExact)
          await resolveChildElementXAttributes(this.el)
      },
    )

    this.contentKey = `remote-content-${slugify(
      this.contentSrc || 'none',
    )}`
  }

  async componentWillRender() {
    debugIf(this.debug, `x-app-view-do: ${this.url} will render`)

    if (this.match?.isExact) {
      debugIf(this.debug, `x-app-view-do: ${this.url} on-enter`)

      const autoNext = Boolean(this.nextAfter && this.nextAfter > 0)
      const duration = autoNext ? (this.nextAfter as number) : 0

      const timer: IViewDoTimer =
        this.el.querySelector('x-video')?.timer ||
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
      if (this.contentElement)
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
      await resolveChildElementXAttributes(div)
      this.route.captureInnerLinks(div)
      return div
    } catch {
      warn(
        `x-app-view-do: ${this.url} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
    }
  }

  render() {
    debugIf(this.debug, `x-app-view-do: ${this.url} render`)
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
    debugIf(this.debug, `x-app-view-do: ${this.url} did render`)
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
    await this.route?.loadCompleted()
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.service?.cleanup?.call(this)
    this.route.destroy()
  }
}
