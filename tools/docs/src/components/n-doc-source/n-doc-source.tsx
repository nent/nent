import {
  Component,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core'

@Component({
  tag: 'n-doc-source',
  shadow: false,
})
export class NDocSource {
  @Element() el!: HTMLNDocSourceElement

  @State() content: string | null = null

  /**
   * Remote Template URL
   */
  @Prop() src!: string

  /**
   * Cross Origin Mode
   */
  @Prop() mode: 'cors' | 'navigate' | 'no-cors' | 'same-origin' =
    'cors'

  /**
   * The source file line-number to start with
   */
  @Prop() from: number = 1

  /**
   * The source file line number to end with
   */
  @Prop() to?: number

  /**
   * The markdown language to use
   *
   */
  @Prop() language: 'html' | 'jsx' = 'html'

  async componentWillLoad() {
    const content = await this.getContent()
    this.content = this.dedent(content) + '\n'
  }

  private async getContent() {
    try {
      const content = await this.fetchSource()
      if (content == null) return

      return ('\n' + content)
        .split('\n')
        .slice(this.from - 1, this.to + 1)
        .join('\n')
    } catch {
      return null
    }
  }

  private async fetchSource() {
    const response = await window.fetch(this.src, {
      mode: this.mode,
    })
    if (response.status == 200 || response.ok) {
      const content = await response.text()
      if (content) return content
      return null
    }
  }

  private dedent(innerText: string) {
    const string = innerText?.replace(/^\n/, '')
    const match = string?.match(/^\s+/)
    return match
      ? string?.replace(new RegExp(`^${match[0]}`, 'gm'), '')
      : string
  }

  render() {
    return (
      <Host>
        <n-content-reference
          script-src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/prism.min.js"
          style-src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/themes/prism.min.css"
        ></n-content-reference>
        <n-content-reference script-src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/plugins/autoloader/prism-autoloader.min.js"></n-content-reference>
        <n-content-markdown>
          <script type="text/markdown">
            ```{this.language}
            {this.content}
            ```
          </script>
        </n-content-markdown>
      </Host>
    )
  }
}
