import {
  Component,
  Element,
  h,
  Host,
  Prop,
  writeTask,
} from '@stencil/core'
import { actionBus, eventBus } from '../../services/actions'
import { commonState, debugIf } from '../../services/common'
import { RouterService } from './services/router'
import { routingState } from './services/state'

/**
 * The root component is the base container for the view-engine and its
 * child components. This element should contain root-level HTML that
 * is global to every view along with \<n-view\>
 * components placed within any global-html.
 *
 * @system routing
 * @extension actions
 * @extension elements
 * @extension provider
 */
@Component({
  tag: 'n-views',
  styleUrl: 'views.css',
  shadow: false,
})
export class ViewRouter {
  @Element() el!: HTMLNViewsElement
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

  private get parentApp() {
    return this.el.closest('n-app')
  }

  componentWillLoad() {
    commonState.routingEnabled = true
    routingState.router = new RouterService(
      window,
      writeTask,
      eventBus,
      actionBus,
      this.root,
      this.parentApp?.appTitle,
      this.transition,
      this.scrollTopOffset,
    )
  }

  componentDidLoad() {
    const startPath = this.startPath
    function start() {
      if (routingState.router) {
        routingState.router?.finalize(startPath)
      }
    }
    if (this.startDelay > 0)
      setTimeout(() => {
        start()
      }, this.startDelay * 1000)
    else start()
    debugIf(commonState.debug, 'n-views: initialized')
  }

  disconnectedCallback() {
    commonState.routingEnabled = false
    routingState.router?.destroy()
  }

  render() {
    return <Host></Host>
  }
}
