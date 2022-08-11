import { commonState } from '../../../services/common/state'
import { IViewPrompt, VisitStrategy } from './interfaces'
import { hasVisited } from './visits'

/**
 * It takes a view prompt, and returns a view prompt with the `visited` and `visit` properties set
 * @param {IViewPrompt} viewPrompt - IViewPrompt
 * @returns A promise that resolves to an object with the following properties:
 *   when: string
 *   visit: VisitStrategy
 *   visited: boolean
 *   path: string
 */
export async function getViewPromptStateProperties(
  viewPrompt: IViewPrompt,
): Promise<IViewPrompt> {
  let { when, path, visit = VisitStrategy.once } = viewPrompt
  let visited = await hasVisited(path)
  if (commonState.dataEnabled && when) {
    const { evaluatePredicate } = await import(
      '../../../services/data/expressions'
    )
    const shouldGo = await evaluatePredicate(when)
    if (shouldGo) {
      visit = VisitStrategy.once
      visited = false
    } else {
      visit = VisitStrategy.optional
    }
  }
  return { when, visit, visited, path }
}

/**
 * > Find the first unvisited item in the list that is not optional
 * @param {IViewPrompt[]} doList - IViewPrompt[]
 * @returns A Promise that resolves to an IViewPrompt or null
 */
async function findFirstUnvisited(
  doList: IViewPrompt[],
): Promise<IViewPrompt | null> {
  const found = doList
    .filter(d => d.visit !== VisitStrategy.optional)
    .find(i => i.visited == false)
  return found || null
}

/**
 * It takes an array of view prompts, and returns the first one that hasn't been visited yet
 * @param childViewDos - Array<IViewPrompt>
 * @returns A promise that resolves to the first unvisited view prompt.
 */
export async function resolveNext(
  childViewDos: Array<IViewPrompt>,
): Promise<IViewPrompt | null> {
  const converted = await Promise.all(
    childViewDos.map(e => getViewPromptStateProperties(e)),
  )

  const result = await findFirstUnvisited(converted)

  return result
}
