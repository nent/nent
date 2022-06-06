/* istanbul ignore file */

;(self as any).importScripts(
  'https://unpkg.com/remarkable@2.0.1/dist/remarkable.min.js',
)
const me: any = self
const { Remarkable, linkify } = me.remarkable
/**
 * Renders markdown
 * @param content
 * @returns markdown
 */
let markdown: any = null

export async function renderMarkdown(
  content: string,
): Promise<string | undefined> {
  if (markdown == null) {
    markdown = new Remarkable({
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
  }
  return markdown.render(content)
}
