import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core'
import { eventBus } from '../../services/actions'
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
import { MatchResults } from '../n-views/services/interfaces'
import { routingState } from '../n-views/services/state'
import { IView } from './services/interfaces'
import { resolveNext } from './services/next'
import { Route } from './services/route'
import { markVisit } from './services/visits'

/**
 * The View component holds a segment of content visible only when
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
  private dataSubscription!: () => void

  @Element() el!: HTMLNViewElement
  @State() match: MatchResults | null = null
  @State() exactMatch = false
  @State() routeElement: HTMLElement | null = null
  @State() contentElement: HTMLElement | null = null
  private contentKey?: string | null
  private sourceKey?: string | null

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
   * resolved values. This also commands this component to
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
      dos: this.childViewDos,
    }
  }

  private get parent() {
    return this.el.parentElement?.closest('n-view') || null
  }

  private get childViewDos(): HTMLNViewPromptElement[] {
    return Array.from(
      this.el.querySelectorAll('n-view-prompt') || [],
    ).filter(e => this.route.isChild(e))
  }

  private get childViews(): HTMLNViewElement[] {
    return Array.from(
      this.el.querySelectorAll('n-view') || [],
    ).filter(e => this.route.isChild(e))
  }

  componentWillLoad() {
    debugIf(this.debug, `n-view: ${this.path} loading`)

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

    this.sourceKey = `rem-source-${slugify(this.src || 'none')}`
  }

  private subscribeToDataEvents() {
    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      async () => {
        debugIf(this.debug, `n-view: ${this.path} data changed `)
        forceUpdate(this)
      },
    )
  }

  async componentWillRender() {
    debugIf(this.debug, `n-view: ${this.path} will render`)

    if (this.match) {
      debugIf(this.debug, `n-view: ${this.path} route is matched `)
      if (this.routeElement == null) {
        this.routeElement = await this.resolveRouteElement()
        this.routeElement?.childNodes.forEach(n => {
          this.el.append(n)
        })
      }

      debugIf(
        this.debug,
        `n-view: ${this.path} found ${this.childViews.length} child views`,
      )

      debugIf(
        this.debug,
        `n-view: ${this.path} found ${this.childViewDos.length} child view-dos`,
      )
    }

    // exact-match
    if (this.match?.isExact) {
      debugIf(
        this.debug,
        `n-view: ${this.path} route is exactly matched `,
      )
      const viewDos = this.childViewDos.map(el => {
        const { path, when, visit } = el
        return { path, when, visit }
      })
      const nextDo = await resolveNext(viewDos)
      if (nextDo) {
        this.route.replaceWithRoute(nextDo.path)
        return
      } else {
        markVisit(this.match?.url)
        this.contentElement = await this.resolveContentElement()
      }
    }
  }

  private async resolveRouteElement() {
    debugIf(
      this.debug,
      `n-view: ${this.path} fetching content from ${this.src}`,
    )
    if (!this.src) {
      return null
    }
    try {
      const content = await resolveRemoteContent(
        window,
        this.src!,
        this.mode,
        this.resolveTokens,
      )
      if (content == null) return null
      const div = window.document.createElement('div')
      div.innerHTML = content
      div.id = this.sourceKey!
      if (commonState.elementsEnabled) {
        await resolveChildElementXAttributes(div)
      }
      this.route.captureInnerLinks(div)
      return div
    } catch {
      warn(
        `n-view: ${this.path} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
    }
  }

  private async resolveContentElement() {
    debugIf(
      this.debug,
      `n-view: ${this.path} fetching content from ${this.contentSrc}`,
    )
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
      const div = document.createElement('div')
      div.slot = 'content'
      div.innerHTML = content
      div.id = this.contentKey!
      if (commonState.elementsEnabled) {
        await resolveChildElementXAttributes(div)
      }
      this.route.captureInnerLinks(div)
      return div
    } catch {
      warn(
        `n-view: ${this.path} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
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
