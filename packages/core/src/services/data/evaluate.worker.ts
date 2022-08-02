/* istanbul ignore file */

;(self as any).importScripts(
  'https://cdn.cdn.jsdelivr.net/npm/expr-eval@2.0.2/dist/bundle.min.js',
)

import type { ExpressionContext } from './interfaces'

/**
 * Documentation: https://github.com/silentmatt/expr-eval
 */
const expressionEvaluator = new (self as any).exprEval.Parser({
  operators: {
    in: true,
    assignment: false,
  },
})

/**
 * This base expression parsing is performed by the library: expr-eval
 *
 * @export evaluate
 * @param {string} expression A js-based expression for value comparisons or calculations
 * @param {object} context An object holding any variables for the expression.
 */
export async function evalExpression(
  expression: string,
  context: ExpressionContext = {},
): Promise<number | boolean | string> {
  let result = false
  try {
    result = expressionEvaluator.evaluate(expression, context)
  } catch (error) {
    console.debug(error)
  }
  return result
}
