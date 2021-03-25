import {
  removeLineFeeds,
  requireValue,
  toBoolean,
  warn,
} from '../common'
import { hasVisited } from '../navigation/visits'
import { evalExpression } from './evaluate.worker'
import { ExpressionContext } from './interfaces'
import { hasToken, resolveTokens } from './tokens'

const operatorRegex = /(in |for |[\>\<\+\-\=]{1})/gi

const funcRegEx = /[\{]{0,2}didVisit\(['"](.*)["']\)[\}]{0,2}/gi

export function hasExpression(value: string) {
  return value.match(operatorRegex) || value.match(funcRegEx)
}

const jsonRegEx = /(\{.*?\})/g

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

export function convertFromJson(expression: string) {
  const data: any = {}
  let newExpression = removeLineFeeds(expression).split(`'`).join(`"`)
  let index = 0
  let match: string | RegExpExecArray | null

  let resultingExpression = newExpression.slice()
  while ((match = jsonRegEx.exec(newExpression))) {
    const json = match[1]
    const value = JSON.parse(json)
    let variable = alphabet[index]
    data[variable] = value
    index++
    resultingExpression = resultingExpression
      .split(json)
      .join(variable)
  }

  return {
    data,
    expression: resultingExpression,
  }
}

async function evaluate(
  expression: string,
  context: ExpressionContext = {},
): Promise<number | boolean | string> {
  requireValue(expression, 'expression')
  if (!hasExpression(expression)) return expression

  try {
    context.null = null
    const resolved = convertFromJson(expression)
    Object.assign(context, resolved.data)

    return await evalExpression(resolved.expression, context)
  } catch (error) {
    warn(
      `An exception was raised evaluating expression '${expression}': ${error}`,
    )
    return `${expression} (error: ${error})`
  }
}

/**
 * This function first resolves any data-tokens, then passes the response to the
 * {evaluate} function.
 *
 * @export evaluateExpression
 * @param {string} expression
 * @param {*} [context={}]
 * @return {*}  {Promise<any>}
 */
export async function evaluateExpression(
  expression: string,
  context: ExpressionContext = {},
): Promise<any> {
  requireValue(expression, 'expression')

  const detokenizedExpression = await resolveTokens(expression, true)
  return evaluate(detokenizedExpression, context)
}

/**
 * This function first resolves any data-tokens, then passes the response to the
 * {evaluate} function, but uses the value to determine a true/false.
 *
 * @export
 * @param {string} expression
 * @param {ExpressionContext} [context={}]
 * @return {*}  {Promise<boolean>}
 */
export async function evaluatePredicate(
  expression: string,
  context: ExpressionContext = {},
): Promise<boolean> {
  requireValue(expression, 'expression')

  let workingExpression = expression.slice()

  if (hasToken(workingExpression))
    workingExpression = await resolveTokens(workingExpression, true)

  if (!workingExpression) return false

  const negation = workingExpression.startsWith('!')

  if (negation) {
    workingExpression = workingExpression.slice(
      1,
      workingExpression.length,
    )
  }

  if (expression.match(funcRegEx)) {
    const matches = funcRegEx.exec(workingExpression)
    const value = matches ? await hasVisited(matches[1]) : false
    workingExpression = workingExpression.replace(
      funcRegEx,
      value.toString(),
    )
  }

  let result: any = toBoolean(workingExpression)
  if (hasExpression(workingExpression)) {
    try {
      result = await evaluate(workingExpression, context)
    } catch {}
  }
  return negation ? !result : result
}
