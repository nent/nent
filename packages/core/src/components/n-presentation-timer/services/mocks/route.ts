/* istanbul ignore file */

import {
  ActionActivationStrategy,
  activateActionActivators,
} from '../../../../services/actions'
import { IRoute } from '../../../n-view/services/interfaces'
import { Route } from '../../../n-view/services/route'
import { MatchResults } from '../../../n-views/services/interfaces'

export class MockRoute implements IRoute {
  public path: string = 'fake'
  public match: MatchResults | null = null
  public scrollOnNextRender = false
  async getPreviousRoute() {
    return null
  }
  async getNextRoute(): Promise<Route | null> {
    return null
  }
  getParentRoute(): Route | null {
    return null
  }
  public previousMatch: MatchResults | null = null

  constructor() {}

  public captureInnerLinks(_root?: HTMLElement) {}

  public async activateActions(
    forEvent: ActionActivationStrategy,
    filter: (
      activator: HTMLNActionActivatorElement,
    ) => boolean = _a => true,
  ) {
    await activateActionActivators([], forEvent, filter)
  }

  public destroy() {}
}
