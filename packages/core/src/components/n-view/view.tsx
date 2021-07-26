import {
  Component,
  Element,
  h,
  Host,
  Method,
  Prop,
  State
} from '@stencil/core'
import { eventBus } from '../../services/actions'
import {
  commonState,
  ComponentRefresher,
  debugIf,
  slugify
} from '../../services/common'
import { warn } from '../../services/common/logging'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveRemoteContentElement } from '../../services/content/remote'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { MatchResults } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'
import { IView } from './services/interfaces'
import { resolveNext } from './services/next'
import { Route } from './services/route'
import { markVisit } from './services/visits'

/**
 * The View element holds a segment of content visible only when
 * a URL path matches. It defines a route and its content.
 * This provides the declarative mechanism
 * for in-page content/component routing by URL.
 *
 * @slot default - The default slot is rendered when this route is
 *                 activated, visible by default to all routes matching
 *                 the route URL (typically, child routes).
 *
 * @slot content - The content route is rendered only when the route
 *                 matches EXACTLY. Note: This HTML is removed when the
 *                 route changes.
 * @system routing
 *
 * @extension data
 * @extension elements
 */
@Component({
  tag: 'n-view',
  styleUrl: 'view.css',
  shadow: true,
})
export class View implements IView {
  private dataSubscription!: ComponentRefresher

  @Element() el!: HTMLNViewElement
  @State() match: MatchResults | null = null
  @State() exactMatch = false
  private srcElement: HTMLElement | null = null
  private contentElement: HTMLElement | null = null
  private contentKey!: string
  private srcKey!: string

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
  @Prop() scrollTopOffset = 0

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * The path for this route, including the parent's
   * routes, excluding the router's root.
   */
  @Prop({ mutable: true, reflect: true }) path!: string

  /**
   * The path for this route should only be matched
   * when it is exact.
   */
  @Prop() exact: boolean = false

  /**
   * Remote URL for this route's HTML. HTML from this
   * URL will be not be assigned to any slot.
   *
   * You can add slot='content' to any containers
   * within this HTML if you have a mix of HTML for
   * this exact-route and its children.
   */
  @Prop() src?: string

  /**
   * Remote URL for this Route's content.
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
   * resolved values. This also commands this element to
   * re-render it's HTML for data-changes. This can affect
   * performance.
   *
   * IMPORTANT: ONLY WORKS ON REMOTE HTML
   */
  @Prop() resolveTokens: boolean = false

  /**
   * Turn on debug statements for load, update and render events.
   */
  @Prop() debug = false

  /**
   * Return all child elements used for processing. This function is
   * primarily meant for testing.
   *
   */
  @Method({
    name: 'getChildren',
  })
  public async getChildren(): Promise<{
    activators: HTMLNActionActivatorElement[]
    views: HTMLNViewElement[]
    dos: HTMLNViewPromptElement[]
  }> {
    return {
      activators: this.route.actionActivators,
      views: this.childViews,
      dos: this.childPrompts,
    }
  }

  private get parent() {
    return this.el.parentElement?.closest('n-view') || null
  }

  private get childPrompts(): HTMLNViewPromptElement[] {
    return Array.from(
      this.el.querySelectorAll('n-view-prompt') || [],
    ).filter(e => this.route.isChild(e))
  }

  private get childViews(): HTMLNViewElement[] {
    return Array.from(
      this.el.querySelectorAll('n-view') || [],
    ).filter(e => this.route.isChild(e))
  }

  async componentWillLoad() {
    debugIf(this.debug, `n-view: ${this.path} loading`)

    this.contentKey = `rem-content-${slugify(
      this.contentSrc || 'none',
    )}`

    this.srcKey = `rem-source-${slugify(this.src || 'none')}`

    if (!routingState.router) {
      warn(
        `n-view: ${this.path} cannot load outside of an n-views element`,
      )
      return
    }

    this.route = routingState.router.createRoute(
      this.el,
      this.parent,
      (match: MatchResults | null) => {
        this.match = match ? ({ ...match } as MatchResults) : null
        this.exactMatch = match?.isExact || false
      },
    )

    if (commonState.dataEnabled && this.resolveTokens) {
      this.dataSubscription = new ComponentRefresher(
        this,
        eventBus,
        'dataEnabled',
        DATA_EVENTS.DataChanged,
      )
    }
  }

  async componentWillRender() {
    debugIf(this.debug, `n-view: ${this.path} will render`)

    if (this.match) {
      debugIf(this.debug, `n-view: ${this.path} route is matched `)
      if (this.src && this.srcElement == null) {
        this.srcElement = await resolveRemoteContentElement(
          window,
          this.src,
          this.mode,
          this.srcKey,
          this.resolveTokens,
        )
        replaceHtmlInElement(
          this.el,
          `#${this.srcKey}`,
          this.srcElement,
        )
      }
      debugIf(
        this.debug,
        `n-view: ${this.path} found ${this.childViews.length} child views and` +
          ` ${this.childPrompts.length} child view-prompts`,
      )

      // exact-match
      if (this.match.isExact) {
        debugIf(
          this.debug,
          `n-view: ${this.path} route exactly matched `,
        )
        const viewDos = this.childPrompts.map(el => {
          const { path, when, visit } = el
          return {
            path: this.route.normalizeChildUrl(path),
            when,
            visit,
          }
        })
        const nextDo = await resolveNext(viewDos)
        if (nextDo) {
          this.route.replaceWithRoute(nextDo.path)
          return
        } else {
          if (this.contentSrc)
            this.contentElement = await resolveRemoteContentElement(
              window,
              this.contentSrc!,
              this.mode,
              this.contentKey,
              this.resolveTokens,
              'content',
            )
          markVisit(this.match?.url)
        }
      }
    }
  }

  render() {
    debugIf(this.debug, `n-view: ${this.path} render`)
    replaceHtmlInElement(
      this.el,
      `#${this.contentKey}`,
      this.contentElement,
    )
    return (
      <Host>
        <slot />
        <slot name="content" />
      </Host>
    )
  }

  async componentDidRender() {
    debugIf(this.debug, `n-view: ${this.path} did render`)

    if (!this.route?.match?.isExact) {
      this.contentElement?.remove()
      this.contentElement = null
    }
    await this.route?.loadCompleted()
  }

  disconnectedCallback() {
    this.dataSubscription?.destroy()
    this.route?.destroy()
  }
}
