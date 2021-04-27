/* istanbul ignore file */

import {
  ActionActivationStrategy,
  activateActionActivators,
} from '../../../../services/actions'
import {
  IRoute,
  MatchResults,
} from '../../../n-views/services/interfaces'

export class MockRoute implements IRoute {
  public path: string = 'fake'
  public match: MatchResults | null = null
  public scrollOnNextRender = false
  async goNext(): Promise<void> {}
  async goBack(): Promise<void> {}
  goToParentRoute(): void {}
  public previousMatch: MatchResults | null = null

  constructor() {}

  public captureInnerLinks(_root?: HTMLElement) {}

  public goToRoute(_path: string) {}

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
