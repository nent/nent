import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
  writeTask,
} from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { commonState, debugIf } from '../../services/common'
import { RouterService } from './services/router'
import { routingState } from './services/state'

/**
 * The root element is the base container for the view-engine and its
 * child elements. This element should contain root-level HTML that
 * is global to every view along with \<n-view\>
 * elements placed within any global-html.
 *
 * @system routing
 * @extension actions
 * @extension elements
 * @extension provider
 */
@Component({
  tag: 'n-views',
  shadow: false,
})
export class ViewRouter {
  @Element() el!: HTMLNViewsElement
  @State() matchedPath?: string

  /**
   * This is the root path that the actual page is,
   * if it isn't '/', then the router needs to know
   * where to begin creating paths.
   */
  @Prop() root: string = '/'

  /**
   * Navigation transition between routes.
   * This is a CSS animation class.
   */
  @Prop() transition?: string

  /**
   * This is the start path a user should
   * land on when they first land on this app.
   */
  @Prop() startPath?: string

  /**
   * Delay redirecting to the start path by
   * this value in seconds.
   */
  @Prop() startDelay: number = 0

  /**
   * Header height or offset for scroll-top on this
   * and all views.
   */
  @Prop() scrollTopOffset?: number

  /**
   * Turn on debugging to get helpful messages from the
   * app, routing, data and action systems.
   */
  @Prop() debug: boolean = false

  /**
   * Enable the not-found display.
   * To customize it, use:
   * slot="not-found"
   */
  @Prop() notFound: boolean = false

  componentWillLoad() {
    let {
      appTitle: title,
      appDescription: description,
      appKeywords: keywords,
    } = this.el.closest('n-app') || {
      appTitle: window.document.title,
    }

    const router = new RouterService(
      window,
      writeTask,
      eventBus,
      actionBus,
      this.root,
      title,
      description,
      keywords,
      this.transition,
      this.scrollTopOffset,
    )

    commonState.routingEnabled = true
    routingState.router = router
    routingState.debug = this.debug || commonState.debug
  }

  render() {
    return (
      <Host style={{ display: 'block' }}>
        <slot></slot>
        {this.notFound ? (
          <div hidden={routingState.hasExactRoute}>
            <slot name="not-found"></slot>
          </div>
        ) : null}
      </Host>
    )
  }

  componentDidLoad() {
    const startPath = this.startPath
    function start() {
      routingState.router?.initialize(startPath)
      debugIf(commonState.debug, 'n-views: initialized')
    }
    if (this.startDelay > 0)
      setTimeout(() => {
        start()
      }, this.startDelay * 1000)
    else start()
  }

  disconnectedCallback() {
    commonState.routingEnabled = false
    routingState.router?.destroy()
  }
}
