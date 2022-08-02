/* istanbul ignore file */

import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/linkify'
export async function renderMarkdown(
  content: string,
): Promise<string | undefined> {
  const markdown = new Remarkable({
    html: true,
    typographer: true,
    breaks: true,
  })
  markdown.use(linkify, {})
  var defaultLinkOpen = markdown.renderer.rules.link_open
  markdown.renderer.rules.link_open = (
    tokens: any,
    idx: number,
    options: any,
  ) => {
    if (tokens[idx].href.startsWith('http'))
      options.linkTarget = '_blank'
    else options.linkTarget = ''
    return defaultLinkOpen(tokens, idx, options)
  }

  return markdown.render(content)
}
