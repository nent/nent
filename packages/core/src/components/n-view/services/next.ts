import { commonState } from '../../../services/common/state'
import { IViewPrompt, VisitStrategy } from './interfaces'
import { hasVisited } from './visits'

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

async function findFirstUnvisited(
  doList: IViewPrompt[],
): Promise<IViewPrompt | null> {
  const found = doList
    .filter(d => d.visit !== VisitStrategy.optional)
    .find(i => i.visited == false)
  return found || null
}

export async function resolveNext(
  childViewDos: Array<IViewPrompt>,
): Promise<IViewPrompt | null> {
  const converted = await Promise.all(
    childViewDos.map(e => getViewPromptStateProperties(e)),
  )

  const result = await findFirstUnvisited(converted)

  return result
}
