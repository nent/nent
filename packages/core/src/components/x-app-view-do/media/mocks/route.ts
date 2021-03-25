/* istanbul ignore file */

import { ActionActivationStrategy } from '../../../../services/actions'
import {
  IRoute,
  MatchResults,
} from '../../../../services/routing/interfaces'

export class MockRoute implements IRoute {
  public path: string = 'fake'
  public match: MatchResults | null = null
  public scrollOnNextRender = false
  goBack(): void {}
  goToParentRoute(): void {}
  public previousMatch: MatchResults | null = null

  constructor() {}

  public captureInnerLinks(_root?: HTMLElement) {}

  public goToRoute(_path: string) {}

  public async activateActions(
    actionActivators: HTMLXActionActivatorElement[],
    forEvent: ActionActivationStrategy,
    filter: (
      activator: HTMLXActionActivatorElement,
    ) => boolean = _a => true,
  ) {
    await Promise.all(
      actionActivators
        .filter(activator => activator.activate === forEvent)
        .filter(filter)
        .map(async activator => await activator.activateActions()),
    )
  }

  public destroy() {}
}
