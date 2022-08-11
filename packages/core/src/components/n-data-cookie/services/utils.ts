/* istanbul ignore file */

import { CookieAttributes } from './interfaces'

/**
 * If the value is true, return the key, otherwise return the key and value
 * @param {string} key - The name of the attribute.
 * @param {string | boolean | undefined} value - The value of the attribute.
 * @returns function stringifyAttribute(
 *   key: string,
 *   value: string | boolean | undefined,
 * ): string {
 *   if (!value) {
 *     return ''
 *   }
 */
function stringifyAttribute(
  key: string,
  value: string | boolean | undefined,
): string {
  if (!value) {
    return ''
  }

  const stringified = `; ${key}`
  if (value === true) {
    return stringified // Boolean attributes shouldn't have a value
  }

  return `${stringified}=${value}`
}

/**
 * It takes a `CookieAttributes` object and returns a string of attributes that can be used in a cookie
 * @param {CookieAttributes} attributes - CookieAttributes
 * @returns A string of the cookie attributes.
 */
function stringifyAttributes(attributes: CookieAttributes): string {
  if (typeof attributes.expires === 'number') {
    const expires = new Date()
    expires.setMilliseconds(
      expires.getMilliseconds() + attributes.expires * 864e5,
    )
    attributes.expires = expires
  }

  return (
    stringifyAttribute(
      'Expires',
      attributes.expires ? attributes.expires.toUTCString() : '',
    ) +
    stringifyAttribute('Domain', attributes.domain) +
    stringifyAttribute('Path', attributes.path) +
    stringifyAttribute('Secure', attributes.secure) +
    stringifyAttribute('SameSite', attributes.sameSite)
  )
}

function readValue(value: string): string {
  return value.replace(/%3B/g, ';')
}

function writeValue(value: string): string {
  return value.replace(/;/g, '%3B')
}

/**
 * It takes a key, value, and attributes, and returns a string
 * @param {string} key - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {CookieAttributes} attributes - CookieAttributes
 * @returns A string that is the key and value of the cookie, and the attributes of the cookie.
 */
function encode(
  key: string,
  value: string,
  attributes: CookieAttributes,
): string {
  return `${writeValue(key).replace(/=/g, '%3D')}=${writeValue(
    value,
  )}${stringifyAttributes(attributes)}`
}

/**
 * It splits the cookie string into an array of cookies, then splits each cookie into an array of name
 * and value, then decodes the name and value, and finally returns an object with the decoded name and
 * value
 * @param {string} cookieString - The string of cookies to parse.
 * @returns A function that takes a string and returns an object.
 */
function parse(cookieString: string): Record<string, string> {
  const result: Record<string, string> = {}
  const cookies = cookieString ? cookieString.split('; ') : []

  for (const cookie of cookies) {
    const parts = cookie.split('=')
    const value = parts.slice(1).join('=')
    const name = readValue(parts[0]).replace(/%3D/g, '=')
    result[name] = readValue(value)
  }

  return result
}

export function getAll(
  document: HTMLDocument,
): Record<string, string> {
  return parse(document.cookie)
}

/**
 * "Given a document and a key, return the value of the cookie with that key."
 *
 * The first line of the function is a comment. Comments are ignored by the compiler
 * @param {HTMLDocument} document - The document object.
 * @param {string} key - The key of the cookie you want to get.
 * @returns The value of the cookie with the given key.
 */
export function getCookie(
  document: HTMLDocument,
  key: string,
): string | undefined {
  return getAll(document)[key]
}

/**
 * "Set a cookie on the document with the given key and value, and the given attributes."
 *
 * The first three parameters are required. The last parameter is optional
 * @param {HTMLDocument} document - HTMLDocument - The document object.
 * @param {string} key - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {CookieAttributes} [attributes] - CookieAttributes
 */
export function setCookie(
  document: HTMLDocument,
  key: string,
  value: string,
  attributes?: CookieAttributes,
): void {
  document.cookie = encode(key, value, { path: '/', ...attributes })
}
