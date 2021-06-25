import { warn } from '../common/logging'
import { commonState } from '../common/state'
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
  return data && tokens && commonState.dataEnabled
    ? await resolveTokens(data)
    : data
}

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

export async function resolveSrc(src: string) {
  // Only detokenize if data services are enabled
  return commonState.dataEnabled && hasToken(src)
    ? await resolveTokens(src)
    : src
}
