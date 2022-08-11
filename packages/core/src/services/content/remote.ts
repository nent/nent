import { warn } from '../common/logging'
import { commonState } from '../common/state'
import { hasToken, resolveTokens } from '../data/tokens'

/**
 * It fetches the content of a given URL and returns it as a string
 * @param {Window} win - Window - The window object of the page you're trying to fetch content from.
 * @param {string} src - The URL of the script to load.
 * @param {RequestMode} mode - The mode of the request. This can be one of the following:
 * @returns The content of the file at the given URL.
 */
export async function fetchContent(
  win: Window,
  src: string,
  mode: RequestMode,
) {
  const response = await win.fetch(src, {
    mode,
  })
  if (response.status == 200 || response.ok) {
    const content = await response.text()
    if (content) return content
    return null
  }
  throw new Error(
    `Request to ${src} was not successful: ${response.statusText}`,
  )
}

/**
 * It fetches a JSON file from a URL, and returns the JSON data
 * @param {Window} win - Window - the window object of the browser
 * @param {string} src - The URL to fetch.
 * @param {RequestMode} mode - RequestMode
 * @param {'GET' | 'POST'} [method=GET] - The HTTP method to use.
 * @param {string} [body] - The body of the request.
 * @returns A promise that resolves to the JSON data.
 */
export async function fetchJson(
  win: Window,
  src: string,
  mode: RequestMode,
  method: 'GET' | 'POST' = 'GET',
  body?: string,
) {
  const response = await win.fetch(src, {
    mode,
    method,
    body,
    headers: {
      'content-type': 'application/json',
    },
  })
  if (response.status == 200 || response.ok) {
    const data = await response.json()
    return data
  }
  throw new Error(
    `Request to ${src} was not successful: ${response.statusText}`,
  )
}

/**
 * It fetches the content of a remote URL, and if data services are enabled, it replaces any tokens in
 * the content with their corresponding values
 * @param {Window} win - The window object of the iframe
 * @param {string} src - The URL of the remote content to fetch.
 * @param {RequestMode} mode - RequestMode - This is the mode of the request. It can be 'cors',
 * 'no-cors', or 'same-origin'.
 * @param {boolean} tokens - boolean
 * @returns The data from the fetchContent function.
 */
export async function resolveRemoteContent(
  win: Window,
  src: string,
  mode: RequestMode,
  tokens: boolean,
) {
  const resolvedSrc = await resolveSrc(src)
  const data = await fetchContent(win, resolvedSrc, mode)
  // Only detokenize if data services are enabled
  return data && tokens && commonState.dataEnabled
    ? await resolveTokens(data)
    : data
}

/**
 * It takes a URL, fetches the content, and returns a div element with the content inside
 * @param {Window} win - The window object of the current page.
 * @param {string} src - The URL to retrieve the content from.
 * @param {RequestMode} mode - RequestMode
 * @param {string} key - The key is a unique identifier for the remote content.
 * @param {boolean} tokens - boolean - whether or not to replace tokens in the remote content
 * @param {string} [slot] - The slot name to use for the content.
 * @returns A div element with the content of the remote file.
 */
export async function resolveRemoteContentElement(
  win: Window,
  src: string,
  mode: RequestMode,
  key: string,
  tokens: boolean,
  slot?: string,
) {
  try {
    const content = await resolveRemoteContent(win, src, mode, tokens)
    if (content == null) return null

    const div = window.document.createElement('div')
    if (slot) div.slot = 'content'
    div.innerHTML = content
    div.id = key
    return div
  } catch {
    warn(`remote: Unable to retrieve from ${src}`)
    return null
  }
}

/**
 * If data services are enabled and the src has a token, resolve the token, otherwise return the src
 * @param {string} src - The source of the image.
 * @returns A function that takes a string and returns a string.
 */
export async function resolveSrc(src: string) {
  // Only detokenize if data services are enabled
  return commonState.dataEnabled && hasToken(src)
    ? await resolveTokens(src)
    : src
}
