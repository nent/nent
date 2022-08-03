/* istanbul ignore file */

;(self as any).importScripts(
  'https://cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/remarkable.min.js',
)
const me: any = self
const { Remarkable, linkify } = me.remarkable
/**
 * Renders markdown
 * @param content
 * @returns markdown
 */
let markdown: any = null

/**
 * It renders markdown to HTML
 * @param {string} content - The markdown content to render
 * @returns A promise that resolves to a string or undefined.
 */
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
