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
import {
  ActionActivationStrategy,
  eventBus,
} from '../../services/actions'
import { commonState, debugIf, slugify } from '../../services/common'
import { warn } from '../../services/common/logging'
import { replaceHtmlInElement } from '../../services/content/elements'
import { resolveRemoteContent } from '../../services/content/remote'
import { resolveChildElementXAttributes } from '../../services/data/elements'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { markVisit, resolveNext } from '../../services/navigation'
import { MatchResults, Route } from '../../services/routing'
import { RouterService } from '../../services/routing/router'

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
 *
 *
 * @system routing
 * @elements true
 *
 */
@Component({
  tag: 'x-app-view',
  styleUrl: 'x-app-view.css',
  shadow: true,
})
export class XAppView {
  private dataSubscription!: () => void
  private route!: Route
  @Element() el!: HTMLXAppViewElement
  @State() match: MatchResults | null = null
  @State() exactMatch = false
  @State() routeElement: HTMLElement | null = null
  @State() contentElement: HTMLElement | null = null
  private contentKey?: string | null
  private routeKey?: string | null

  /**
   * The router-service instance  (internal)
   *
   */
  @Prop({ mutable: true }) router!: RouterService

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
  @Prop() scrollTopOffset = 0

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * The url for this route, including the parent's
   * routes.
   */
  @Prop({ mutable: true, reflect: true }) url!: string

  /**
   * The url for this route should only be matched
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
    activators: HTMLXActionActivatorElement[]
    views: HTMLXAppViewElement[]
    dos: HTMLXAppViewDoElement[]
  }> {
    return {
      activators: this.actionActivators,
      views: this.childViews,
      dos: this.childViewDos,
    }
  }

  private get parent() {
    return this.el.parentElement?.closest('x-app-view')
  }

  private get routeContainer() {
    return this.el.closest('x-app')
  }

  private get actionActivators(): HTMLXActionActivatorElement[] {
    return Array.from(
      this.el.querySelectorAll('x-action-activator'),
    ).filter(e => this.isChild(e))
  }

  private get childViewDos(): HTMLXAppViewDoElement[] {
    return Array.from(
      this.el.querySelectorAll('x-app-view-do') || [],
    ).filter(e => this.isChild(e))
  }

  private get childViews(): HTMLXAppViewElement[] {
    return Array.from(
      this.el.querySelectorAll('x-app-view') || [],
    ).filter(e => this.isChild(e))
  }

  private isChild(element: HTMLElement) {
    return (
      element.closest('x-app-view') == this.el ||
      element.parentElement == this.el ||
      element.parentElement?.closest('x-app-view') === this.el
    )
  }

  componentWillLoad() {
    debugIf(this.debug, `x-app-view: ${this.url} loading`)

    if (!this.routeContainer || !this.routeContainer.router) {
      warn(
        `x-app-view: ${this.url} cannot load outside of an x-app element`,
      )
      return
    }

    this.router = this.routeContainer.router

    if (!this.router) return

    this.route = this.router.createRoute(
      this.el,
      this.url,
      this.exact,
      this.pageTitle,
      this.transition || this.parent?.transition || null,
      this.scrollTopOffset,
      (match: MatchResults | null) => {
        this.match = match
        this.exactMatch = match?.isExact || false
      },
    )

    debugIf(
      this.debug,
      `x-app-view: ${this.url} match: ${
        this.route.match ? 'true' : 'false'
      }`,
    )

    debugIf(
      this.debug,
      `x-app-view: ${this.url} found ${this.childViews.length} child views`,
    )
    this.childViews.forEach(v => {
      v.url = this.route.normalizeChildUrl(v.url)
      v.transition = v.transition || this.transition
    })

    debugIf(
      this.debug,
      `x-app-view: ${this.url} found ${this.childViewDos.length} child view-dos`,
    )
    this.childViewDos.forEach(v => {
      v.url = this.route.normalizeChildUrl(v.url)
      v.transition = v.transition || this.transition
    })

    this.dataSubscription = eventBus.on(
      DATA_EVENTS.DataChanged,
      () => {
        debugIf(this.debug, `x-app-view: ${this.url} data changed `)
        if (this.match) forceUpdate(this)
      },
    )

    this.contentKey = `rem-content-${slugify(
      this.contentSrc || 'none',
    )}`

    this.routeKey = `rem-route-${slugify(this.src || 'none')}`
  }

  async componentWillRender() {
    debugIf(this.debug, `x-app-view: ${this.url} will render`)

    if (this.match) {
      debugIf(this.debug, `x-app-view: ${this.url} route is matched `)
      if (this.routeElement == null) {
        this.routeElement = await this.resolveRouteElement()
        this.routeElement?.childNodes.forEach(n => {
          this.el.append(n)
        })
        this.childViews.forEach(v => {
          v.url = this.route.normalizeChildUrl(v.url)
          v.transition = v.transition || this.transition
        })
      }
    }

    // exact-match
    if (this.match?.isExact) {
      debugIf(
        this.debug,
        `x-app-view: ${this.url} route is exactly matched `,
      )
      const viewDos = this.childViewDos.map(el => {
        const { url, when, visit } = el
        return { url, when, visit }
      })
      const nextDo = await resolveNext(viewDos)
      if (nextDo) {
        this.route.replaceWithRoute(nextDo.url)
        return
      } else {
        markVisit(this.match.url)
        this.contentElement = await this.resolveContentElement()
      }
    } else {
      this.resetContent()
    }
  }

  private async resolveRouteElement() {
    debugIf(
      this.debug,
      `x-app-view: ${this.url} fetching content from ${this.src}`,
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
      div.id = this.routeKey!
      if (commonState.elementsEnabled) {
        await resolveChildElementXAttributes(div)
      }
      this.route.captureInnerLinks(div)
      return div
    } catch {
      warn(
        `x-app-view: ${this.url} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
    }
  }

  private async resolveContentElement() {
    debugIf(
      this.debug,
      `x-app-view: ${this.url} fetching content from ${this.contentSrc}`,
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
        `x-app-view: ${this.url} Unable to retrieve from ${this.contentSrc}`,
      )
      return null
    }
  }

  async componentDidRender() {
    debugIf(this.debug, `x-app-view: ${this.url} did render`)
    if (this.match?.isExact) {
      await this.route?.activateActions(
        this.actionActivators,
        ActionActivationStrategy.OnEnter,
      )
    } else {
      if (this.route?.didExit()) {
        await this.route?.activateActions(
          this.actionActivators,
          ActionActivationStrategy.OnExit,
        )
      }
    }
    await this.route?.loadCompleted()
  }

  private resetContent() {
    this.contentElement = null
  }

  disconnectedCallback() {
    this.dataSubscription?.call(this)
    this.route?.destroy()
  }

  render() {
    debugIf(this.debug, `x-app-view: ${this.url} render`)
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
}
