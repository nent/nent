import {
  ActionActivationStrategy,
  IActionElement,
} from './interfaces'

/**
 * Activates action activators
 * @param actionActivators
 * @param forEvent
 * @param [filter]
 */
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

/**
 * It sends all the actions in the array that pass the filter function
 * @param {IActionElement[]} actions - An array of IActionElement objects.
 * @param filter - (action: IActionElement | any) => boolean = _a => true,
 */
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
