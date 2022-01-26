import {
  ActionActivationStrategy,
  IActionElement,
} from './interfaces'

export async function activateActionActivators(
  actionActivators: HTMLNActionActivatorElement[],
  forEvent: ActionActivationStrategy,
  filter: (activator: HTMLNActionActivatorElement) => boolean = _a =>
    true,
) {
  let once =
    forEvent == ActionActivationStrategy.AtTime ||
    forEvent == ActionActivationStrategy.AtTimeEnd
  await Promise.all(
    actionActivators
      .filter(activator => activator.activate === forEvent)
      .filter(filter)
      .map(async activator => {
        await activator.activateActions(once)
      }),
  )
}

export async function sendActions(
  actions: IActionElement[],
  filter: (action: IActionElement | any) => boolean = _a => true,
) {
  await Promise.all(
    actions.filter(filter).map(async action => {
      await action.sendAction()
    }),
  )
}
