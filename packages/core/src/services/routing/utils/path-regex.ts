/* istanbul ignore file */
/**
 * TS adaption of https://github.com/pillarjs/path-to-regexp/blob/master/index.js
 */

export interface RegExpOptions {
  sensitive?: boolean
  strict?: boolean
  end?: boolean
  delimiter?: string
  delimiters?: string | string[]
  endsWith?: string | string[]
}

export interface ParseOptions {
  delimiter?: string
  delimiters?: string | string[]
}

export interface Key {
  name: string | number
  prefix: string | null
  delimiter: string | null
  optional: boolean
  repeat: boolean
  pattern: string | null
  partial: boolean
}

export interface PathFunctionOptions {
  encode?: (value: string) => string
}

export type Token = string | Key
export type Path = string | RegExp | Array<string | RegExp>
export type PathFunction = (
  data?: Record<string, any>,
  options?: PathFunctionOptions,
) => string

/**
 * Default configs.
 */
const DEFAULT_DELIMITER = '/'
const DEFAULT_DELIMITERS = './'

/**
 * The main path matching regexp utility.
 */
const PATH_REGEXP = new RegExp(
  [
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined]
    '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?',
  ].join('|'),
  'g',
)

/**
 * Parse a string for the raw tokens.
 */
export const parse = (
  string: string,
  options?: ParseOptions,
): Token[] => {
  const tokens = []
  let key = 0
  let index = 0
  let path = ''
  const defaultDelimiter = options?.delimiter || DEFAULT_DELIMITER
  const delimiters = options?.delimiters || DEFAULT_DELIMITERS
  let pathEscaped = false
  let res

  while ((res = PATH_REGEXP.exec(string)) !== null) {
    const m = res[0]
    const escaped = res[1]
    const offset = res.index
    path += string.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      pathEscaped = true
      continue
    }

    let previous = ''
    const next = string[index]
    const name = res[2]
    const capture = res[3]
    const group = res[4]
    const modifier = res[5]

    if (!pathEscaped && path.length > 0) {
      const k = path.length - 1

      if (delimiters.includes(path[k])) {
        previous = path[k]
        path = path.slice(0, k)
      }
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
      pathEscaped = false
    }

    const partial =
      previous !== '' && next !== undefined && next !== previous
    const repeat = modifier === '+' || modifier === '*'
    const optional = modifier === '?' || modifier === '*'
    const delimiter = previous || defaultDelimiter
    const pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: previous,
      delimiter,
      optional,
      repeat,
      partial,
      pattern: pattern
        ? escapeGroup(pattern)
        : `[^${escapeString(delimiter)}]+?`,
    })
  }

  // Push any remaining characters.
  if (path || index < string.length) {
    tokens.push(path + string.slice(index))
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 */
export const compile = (string: string, options?: ParseOptions) =>
  tokensToFunction(parse(string, options))

/**
 * Expose a method for transforming tokens into the path function.
 */
export const tokensToFunction = (tokens: Token[]): PathFunction => {
  // Compile all the tokens into regexps.
  const matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (const [i, token] of tokens.entries()) {
    if (typeof token === 'object') {
      matches[i] = new RegExp(`^(?:${token.pattern})$`)
    }
  }

  return (
    data?: Record<string, any>,
    options?: PathFunctionOptions,
  ): string => {
    let path = ''
    const encode = options?.encode || encodeURIComponent

    for (const [i, token] of tokens.entries()) {
      if (typeof token === 'string') {
        path += token
        continue
      }

      const value = data ? data[token.name] : undefined
      let segment: string

      if (Array.isArray(value)) {
        if (!token.repeat) {
          throw new TypeError(
            `Expected "${token.name}" to not repeat, but got array`,
          )
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          }

          throw new TypeError(
            `Expected "${token.name}" to not be empty`,
          )
        }

        for (const [j, element] of value.entries()) {
          segment = encode(element)

          if (!matches[i].test(segment)) {
            throw new TypeError(
              `Expected all "${token.name}" to match "${token.pattern}"`,
            )
          }

          path += `${
            j === 0 ? token.prefix : token.delimiter
          }${segment}`
        }

        continue
      }

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        segment = encode(String(value))

        if (!matches[i].test(segment)) {
          throw new TypeError(
            `Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`,
          )
        }

        path += `${token.prefix}${segment}`
        continue
      }

      if (token.optional) {
        // Prepend partial segment prefixes.
        if (token.partial) {
          path += token.prefix
        }

        continue
      }

      throw new TypeError(
        `Expected "${token.name}" to be ${
          token.repeat ? 'an array' : 'a string'
        }`,
      )
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 */
export const escapeString = (string: string) =>
  string.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')

/**
 * Escape the capturing group by escaping special characters and meaning.
 */
const escapeGroup = (group: string) =>
  group.replace(/([=!:$/()])/g, '\\$1')

/**
 * Get the flags for a regexp from the options.
 */
const flags = (options: RegExpOptions): string =>
  options?.sensitive ? '' : 'i'

/**
 * Pull out keys from a regexp.
 */
const regexpToRegexp = (path: RegExp, keys: Key[]): RegExp => {
  if (!keys) {
    return path
  }

  // Use a negative lookahead to match only capturing groups.
  const groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (let i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        pattern: null,
      })
    }
  }

  return path
}

/**
 * Transform an array into a regexp.
 */
const arrayToRegexp = (
  path: Array<string | RegExp>,
  keys: Key[],
  options: RegExpOptions,
): RegExp => {
  const parts = []

  for (const element of path) {
    parts.push(pathToRegexp(element, keys, options).source)
  }

  return new RegExp(`(?:${parts.join('|')})`, flags(options))
}

/**
 * Create a path regexp from string input.
 */
const stringToRegexp = (
  path: string,
  keys: Key[],
  options: RegExpOptions,
): RegExp => tokensToRegExp(parse(path, options), keys, options)

/**
 * Expose a function for taking tokens and returning a RegExp.
 */
export const tokensToRegExp = (
  tokens: Token[],
  keys?: Key[],
  options?: RegExpOptions,
): RegExp => {
  options = options || {}

  const { strict } = options
  const end = options.end !== false
  const delimiter = escapeString(
    options.delimiter || DEFAULT_DELIMITER,
  )
  const delimiters = options.delimiters || DEFAULT_DELIMITERS
  const endsWith = (options.endsWith?.length
    ? [...options.endsWith]
    : options.endsWith
    ? [options.endsWith]
    : []
  )
    .map(i => escapeString(i as string))
    .concat('$')
    .join('|')
  let route = ''
  let isEndDelimited = false

  // Iterate over the tokens and create our regexp string.
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
      isEndDelimited =
        i === tokens.length - 1 &&
        delimiters.includes(token[token.length - 1])
    } else {
      const prefix = escapeString(token.prefix || '')
      const capture = token.repeat
        ? `(?:${token.pattern})(?:${prefix}(?:${token.pattern}))*`
        : token.pattern

      if (keys) {
        keys.push(token)
      }

      if (token.optional) {
        route += token.partial
          ? `${prefix}(${capture})?`
          : `(?:${prefix}(${capture}))?`
      } else {
        route += `${prefix}(${capture})`
      }
    }
  }

  if (end) {
    if (!strict) {
      route += `(?:${delimiter})?`
    }

    route += endsWith === '$' ? '$' : `(?=${endsWith})`
  } else {
    if (!strict) {
      route += `(?:${delimiter}(?=${endsWith}))?`
    }

    if (!isEndDelimited) {
      route += `(?=${delimiter}|${endsWith})`
    }
  }

  return new RegExp(`^${route}`, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
export const pathToRegexp = (
  path: Path,
  keys: Key[],
  options: RegExpOptions,
): RegExp => {
  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys)
  }

  if (Array.isArray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}
