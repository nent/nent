import {
  getPropertyValue,
  isJson,
  isNotValue,
  isObject,
  isString,
  isValue,
  requireValue,
  warn,
} from '../common'
import {
  addDataProvider,
  getDataProvider,
  removeDataProvider,
} from './factory'
import { DataItemProvider } from './providers/item'
import { dataState } from './state'

const tokenRegEx =
  /\{\{([\w-]*):(\w*)((?:\[\d+\]|\.)[\w.\-\]]+)?(?:\?([\w.-]*))?\}\}/g

const escapeStringsRegex = /['"]?([a-z/][\w-/?.]+)['"]?/gi

export function hasToken(value: string) {
  return value.match(tokenRegEx)
}

/**
 * This function replaces all tokens: (ie `{{provider:key}}`) values with the actual values
 * from the expressed provider & key. This is used by {evaluateExpression}
 * before it is sent to {evaluate} for calculation.
 *
 * @export resolveTokens
 * @param {string} textWithTokens
 * @return {*}  {(Promise<string|null>)}
 */
export async function resolveTokens(
  textWithTokens: string,
  forExpression: boolean = false,
  data?: any,
): Promise<string> {
  requireValue(textWithTokens, 'valueExpression')
  if (!dataState.enabled) {
    warn(`Data-services are not enabled. Tokens are not resolved.`)
    return textWithTokens
  }

  let result = textWithTokens.slice()
  if (textWithTokens === null || textWithTokens === '') {
    return result
  }

  // If this expression doesn't match, leave it alone
  if (!hasToken(textWithTokens)) {
    return result
  }

  if (data != undefined && data != null) {
    addDataProvider('data', new DataItemProvider(data))
  }

  // Replace each match
  let match: string | RegExpExecArray | null

  while ((match = tokenRegEx.exec(textWithTokens))) {
    const expression = match[0]
    const providerKey = match[1]
    const dataKey = match[2]
    const propKey = match[3] || ''
    const defaultValue = match[4] || null

    const provider = await getDataProvider(providerKey)

    if (provider == null && !forExpression) continue

    let value = await provider?.get(dataKey)
    if (value == undefined) value = defaultValue

    if (propKey && isValue(value)) {
      const object = isJson(value) ? JSON.parse(value!) : value
      let resolved = getPropertyValue(object, propKey, defaultValue)

      value = isString(resolved)
        ? resolved
        : isObject(resolved)
        ? JSON.stringify(resolved)
        : `${resolved}`
    }

    let replacement = isObject(value)
      ? JSON.stringify(value).split('"').join("'")
      : value?.toString() || ''
    if (forExpression && !isObject(value)) {
      if (isNotValue(value) || value === '') replacement = 'null'
      else
        replacement = replacement!.replace(escapeStringsRegex, `'$1'`)
    }

    result = result.replace(expression, replacement)
  }

  if (data) {
    removeDataProvider('data')
  }

  return result
}
