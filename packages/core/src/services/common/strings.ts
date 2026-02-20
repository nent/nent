import { isNotValue } from './values'

/**
 * Turns 'truthy' values into true and 'falsy' into false.
 * @param {any} value
 * @return {boolean}
 */
export function toBoolean(value: string) {
  if (value == null) {
    return false
  }

  const stringResult = value.slice()
  if (
    [
      'false',
      'no',
      'off',
      '!',
      '0',
      'null',
      'undefined',
      '',
    ].includes(stringResult.toLocaleLowerCase().trim())
  ) {
    return false
  }

  if (
    ['true', 'yes', 'on'].includes(
      stringResult.toLocaleLowerCase().trim(),
    )
  ) {
    return true
  }

  return value !== ''
}

/**
 * Convert kebab case to camel
 *
 * @example some-attribute => someAttribute
 *
 * @param {string} kebabString
 * @return {string}
 */
export function kebabToCamelCase(kebabString: string): string {
  return kebabString
    .toLowerCase()
    .replace(/-./g, x => x[1].toUpperCase())
}

/**
 * Convert all words to capitalized
 *
 * @example some words => Some Words
 *
 * @param {string} value
 * @return {string}
 */
export function capitalize(value: string): string {
  if (isNotValue(value)) return value
  let result = value.toLowerCase().split(' ')
  for (var i = 0; i < result.length; i++) {
    result[i] = result[i].charAt(0).toUpperCase() + result[i].slice(1)
  }
  return result.join(' ')
}

/**
 * Convert a string into a url-safe slug
 * @param value
 */
export function slugify(value: string): string {
  if (isNotValue(value)) return value
  return value
    .toString() // Cast to string
    .toLowerCase() // Convert the string to lowercase letters
    .normalize('NFD') // The normalize() method returns the Unicode Normalization Form of a given string.
    .trim() // Remove whitespace from both sides of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/-{2,}/g, '-') // Replace multiple - with single -
}

/**
 * Removes line feeds
 * @param value
 * @returns
 */
export function removeLineFeeds(value: string): string {
  if (isNotValue(value)) return value
  return value
    .split('\n')
    .join('')
    .split('\r')
    .join('')
    .split('\t')
    .join('')
    .replace(/\s{2,}/g, ' ')
}
