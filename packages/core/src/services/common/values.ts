/* eslint-disable clean-regex/no-lazy-ends */
/**
 * Throws an error if the value parameter is not defined.
 * @param {string} value the value that should not be null
 * @param {string} name the name of the parameter/variable to use in the error
 * @param {string|null} origin the name of the component/system throwing the error
 */
export function requireValue(
  value: any,
  name: string,
  origin: string | null = null,
): void {
  if (isNotValue(value)) {
    throw new Error(
      `${origin || 'nent'} : A value for ${name} was not provided.`,
    )
  }
}

/**
 * Evaluate a value for existence. True if not null or undefined
 * @param {string} value
 * @returns {boolean}
 */
export function isValue(value: any): boolean {
  return isNotValue(value) === false
}

/**
 * Evaluate a value for non-existence. True if null or undefined
 * @param {string} value
 * @returns {boolean}
 */
export function isNotValue(value: any): boolean {
  return value === undefined || value === null
}

/**
 * Determines whether value is of type object
 * @param value
 * @returns true if object
 */
export function isObject(value: any): boolean {
  return isValue(value) && typeof value === 'object'
}

/**
 * Determines whether value is of type string
 * @param value
 * @returns true if string
 */
export function isString(value: any): boolean {
  return typeof value === 'string'
}

/**
 * Determines whether value is a serialized object
 * @param value
 * @returns true if string
 */
export function isJson(value: any): boolean {
  if (!isString(value)) return false
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

/**
 * Gets a property value from an object
 * (Like lodash get)
 * @param obj
 * @param key {string}|{string[]}
 * @param defaultValue
 * @returns property value
 */
export function getPropertyValue(
  obj: any,
  key: string[] | string,
  defaultValue: any = null,
): any {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(key, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) =>
          res !== null && res !== undefined ? res[key] : res,
        obj,
      )
  const result = travel(/[,\[\]]+?/) || travel(/[,\[\].]+?/)
  return result === undefined || result === obj
    ? defaultValue
    : result
}

/**
 * Turn anything into an array.
 *
 * @param {any} any
 *
 * @returns {Array<any>}
 */

export function valueToArray(any: any): Array<any> {
  return any ? (Array.isArray(any) ? any : [any]) : []
}
