/* istanbul ignore file */

;(self as any).importScripts(
  'https://cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/remarkable.min.js',
)

let markdown: any = null
/**
 * Renders markdown
 * @param content
 * @returns markdown
 */
export async function renderMarkdown(
  content: string,
): Promise<string | undefined> {
  if (markdown == null) {
    markdown = new (self as any).remarkable.Remarkable({
      html: true,
      typographer: true,
      break: true,
    })
  }
  return markdown.render(content)
}
