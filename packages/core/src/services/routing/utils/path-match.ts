/* istanbul ignore file */

import {
  LocationSegments,
  MatchOptions,
  MatchResults,
} from '../interfaces'
import { valueEqual } from './location'
import { Key, Path, pathToRegexp } from './path-regex'

interface CompileOptions {
  end: boolean
  strict: boolean
}

let cacheCount = 0
const patternCache: Record<string, any> = {}
const cacheLimit = 10000

// Memoized function for creating the path match regex
const compilePath = (
  pattern: Path,
  options: CompileOptions,
): { re: RegExp; keys: Key[] } => {
  const cacheKey = `${options.end}${options.strict}`
  const cache =
    patternCache[cacheKey] || (patternCache[cacheKey] = {})
  const cachePattern = JSON.stringify(pattern)

  if (cache[cachePattern]) {
    return cache[cachePattern]
  }

  const keys: Key[] = []
  const re = pathToRegexp(pattern, keys, options)
  const compiledPattern = { re, keys }

  if (cacheCount < cacheLimit) {
    cache[cachePattern] = compiledPattern
    cacheCount += 1
  }

  return compiledPattern
}

/**
 * Public API for matching a URL pathname to a path pattern.
 */
export function matchPath(
  location: LocationSegments,
  options: MatchOptions = {},
): MatchResults | null {
  if (typeof options === 'string') {
    options = { path: options }
  }

  const { pathname } = location

  const { path = '/', exact = false, strict = false } = options
  const { re, keys } = compilePath(path, { end: exact, strict })
  const match = re.exec(pathname)

  if (!match) {
    return null
  }

  const [url, ...values] = match
  const isExact = pathname === url

  if (exact && !isExact) {
    return null
  }

  const result: MatchResults = {
    path, // The path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // The matched portion of the URL
    isExact, // Whether or not we matched exactly
    params: keys.reduce<Record<string, string>>(
      (memo, key: Key, index) => {
        memo[key.name] = values[index]
        return memo
      },
      {},
    ),
  }

  if (result.isExact) {
    Object.assign(location.params, result.params)
  }

  return result
}

export const matchesAreEqual = (
  a: MatchResults | null,
  b: MatchResults | null,
) => {
  if (a === null && b === null) {
    return true
  }

  if (b === null) {
    return false
  }

  return (
    a &&
    b &&
    a.path === b.path &&
    a.url === b.url &&
    valueEqual(a.params, b.params)
  )
}
