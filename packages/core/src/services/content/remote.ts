import { dataState } from '../data/state'
import { hasToken, resolveTokens } from '../data/tokens'

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

export async function resolveRemoteContent(
  win: Window,
  src: string,
  mode: RequestMode,
  tokens: boolean,
) {
  const resolvedSrc = await resolveSrc(src)
  const data = await fetchContent(win, resolvedSrc, mode)
  // Only detokenize if data services are enabled
  return data && tokens && dataState.enabled
    ? await resolveTokens(data)
    : data
}

export async function resolveSrc(src: string) {
  // Only detokenize if data services are enabled
  return dataState.enabled && hasToken(src)
    ? await resolveTokens(src)
    : src
}
