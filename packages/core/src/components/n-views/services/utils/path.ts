/* istanbul ignore file */

import { isValue } from '../../../../services/common'
import { LocationSegments } from '../interfaces'
import { Route } from '../route'

/**
 * Ensures basename
 * @param path
 * @param prefix
 * @returns
 */
export function ensureBasename(path: string, prefix: string) {
  let result = hasBasename(path, prefix) ? path : `${prefix}/${path}`
  result = stripTrailingSlash(result.replace(/\/{2,}/g, '/'))
  return addLeadingSlash(result)
}

/**
 * Paths has basename
 * @param path
 * @param prefix
 */
export const hasBasename = (path: string, prefix: string = '/') =>
  path.startsWith(prefix) ||
  new RegExp(`^${prefix}(\\/|\\?|#|$)`, 'i').test(path)

/**
 * Paths strip basename
 * @param path
 * @param prefix
 * @returns
 */
export const stripBasename = (path: string, prefix: string) => {
  let stripped = hasBasename(path, prefix)
    ? path.slice(prefix.length)
    : path
  return addLeadingSlash(stripped)
}

/**
 * Paths is filename
 * @param path
 */
export const isFilename = (path: string) => path.includes('.')

/**
 * Paths strip trailing slash
 * @param path
 */
export const stripTrailingSlash = (path: string) =>
  path?.endsWith('/') ? path.slice(0, -1) : path

/**
 * Paths add leading slash
 * @param path
 */
export const addLeadingSlash = (path: string) =>
  path?.startsWith('/') ? path : `/${path}`

/**
 * Paths strip leading slash
 * @param path
 */
export const stripLeadingSlash = (path: string) =>
  path?.startsWith('/') ? path.slice(1) : path

/**
 * Parses path
 * @param [path]
 * @returns path
 */
export function parsePath(path = '/'): LocationSegments {
  let pathname = path
  let search = ''
  let hash = ''

  const hashIndex = pathname.indexOf('#')
  if (hashIndex !== -1) {
    hash = pathname.slice(hashIndex)
    pathname = pathname.slice(0, Math.max(0, hashIndex))
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex !== -1) {
    search = pathname.slice(searchIndex)
    pathname = pathname.slice(0, Math.max(0, searchIndex))
  }

  return {
    pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash,
    query: {},
    key: '',
    params: {},
  }
}

/**
 * Creates path
 * @param location
 * @returns
 */
export function createPath(location: LocationSegments) {
  const { pathname, search, hash } = location
  let path = pathname || '/'

  if (search && search !== '?') {
    path += search?.startsWith('?') ? search : `?${search}`
  }

  if (hash && hash !== '#') {
    path += hash?.startsWith('#') ? hash : `#${hash}`
  }

  return path
}

/**
 * Parses query string
 * @param query
 * @returns
 */
export function parseQueryString(query: string) {
  if (!query) {
    return {}
  }

  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce<Record<string, any>>((parameters, parameter) => {
      const [key, value] = parameter.split('=')

      parameters[key] = value
        ? decodeURIComponent(value.replace(/\+/g, ' '))
        : ''
      return parameters
    }, {})
}

/**
 * Turn a URL path to an array of possible parent-routes
 *
 * '/home/profile' -> ['/','/home', '/home/profile']
 */
export function getPossibleParentPaths(path: string) {
  if (!isValue(path)) return []
  let workingPath = path.endsWith('/')
    ? path.slice(0, path.length - 1)
    : path.slice()
  const results: string[] = [path.slice()]
  let index = workingPath.lastIndexOf('/')
  while (index > 0) {
    workingPath = workingPath.substr(0, index)
    results.push(workingPath.slice())
    index = workingPath.lastIndexOf('/')
  }
  if (path != '/') results.push('/')
  return results.reverse()
}

/**
 *  Get the direct parent path
 */
export function getParentPath(path: string) {
  if (!isValue(path)) return null
  const parents = getPossibleParentPaths(path)
  if (parents.length >= 2) return parents.reverse()[1]
  return null
}

// export function getParentRoutes(route: Route, routes: Route[]) {}

/**
 * Get all sibling paths from a path
 */
export function getSiblingRoutes(path: string, routes: Route[]) {
  if (!isValue(path)) return []
  const segments = (url: string) => {
    return url.split('/').length
  }
  const parent = getParentPath(path)
  if (!isValue(parent)) return []
  const level = segments(path)
  const siblings = routes.filter(
    r => r.path.startsWith(parent!) && segments(r.path) == level,
  )

  return siblings.sort((a, b) =>
    a.routeElement.compareDocumentPosition(b.routeElement) &
    Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1,
  )
}

export function getChildRoutes(path: string, routes: Route[]) {
  if (!isValue(path)) return []
  const segments = (url: string) => {
    return url.split('/').length
  }
  const level = segments(path)
  const siblings = routes.filter(
    r => r.path.startsWith(path!) && segments(r.path) == level + 1,
  )

  return siblings.sort((a, b) =>
    a.routeElement.compareDocumentPosition(b.routeElement) &
    Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1,
  )
}
