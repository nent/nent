import { Component, Element, h, writeTask } from '@stencil/core'

@Component({
  tag: 'x-doc-log',
  styleUrl: 'x-doc-log.css',
  shadow: true,
})
export class DocLog {
  @Element() el!: HTMLXDocLogElement
  // private log!: HTMLDivElement
  // private logContainer!: HTMLDivElement
  //
  private proxyConsole(name: string, autoScroll: boolean) {
    this[`old${name}`] = console[name]
    const log = this.el.shadowRoot.querySelector('#log')!
    const logContainer = this.el.shadowRoot.querySelector(
      '#container',
    )!
    console[name] = (...args: any[]) => {
      this[`old${name}`].call(undefined, ...args)
      const output = this.produceOutput(name, args)
      if (autoScroll) {
        const isScrolledToBottom =
          logContainer.scrollHeight - logContainer.clientHeight <=
          logContainer.scrollTop + 1
        log.innerHTML += output
        if (isScrolledToBottom) {
          logContainer.scrollTop =
            logContainer.scrollHeight - logContainer.clientHeight
        }
      } else {
        log.innerHTML += output
      }
    }
  }

  private produceOutput(name: string, args: any[]) {
    let usingColors = false
    return args.reduce((output, arg, index) => {
      if (usingColors && index > 0) return output
      if (arg.startsWith?.call(arg, '%c') || false) {
        usingColors = true
        const segments = arg.split('%c')
        let tags = segments.map((s: any, i: number) =>
          s.length
            ? `<span style="${args[index + i]}" >${s}</span>`
            : '',
        )
        tags = tags.join('')
        args = [arg]
        return `${output}<div class="log-${name}">${tags}</div>\n`
      }
      return typeof arg === 'object' && arg !== undefined
        ? this.json2table([arg], `log-${name}`)
        : `${output}<div class="log-${name}">${arg}</div>\n`
    }, '')
  }

  private json2table(json: any[], classes: string) {
    var cols = Object.keys(json[0])

    var headerRow = ''
    var bodyRows = ''

    classes = classes || ''

    function capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const headerStyles = `
    background-color: #555;
    border: solid 2px #555;
    color: #fff;
    padding: 2px;
    text-align: left;`
      .split('\n')
      .join('')
      .split(' ')
      .join('')

    cols.map(col => {
      headerRow += `<th style="${headerStyles}">${capitalizeFirstLetter(
        col,
      )}</th>`
    })

    json.map(function (row: { [x: string]: string }) {
      bodyRows += '<tr>'

      cols.map(function (colName) {
        bodyRows += '<td>' + row[colName] + '</td>'
      })

      bodyRows += '</tr>'
    })

    const tableStyles = `overflow-x: auto;
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        border-spacing: 0;
        border-color: #555;
        border-width: 2px;
        margin-top:2px`
      .split(`\n`)
      .join('')
      .split(' ')
      .join('')

    return `<table style="${tableStyles}"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`
  }

  private rewireLoggingToElement(autoScroll: boolean) {
    this.proxyConsole('log', autoScroll)
    this.proxyConsole('debug', autoScroll)
    this.proxyConsole('warn', autoScroll)
    this.proxyConsole('error', autoScroll)
    this.proxyConsole('info', autoScroll)
    this.proxyConsole('dir', autoScroll)
    this.proxyConsole('table', autoScroll)
  }

  private unproxyConsole(name: string) {
    // @ts-ignore
    console[name] = this[`old${name}`]
  }

  componentDidLoad() {
    writeTask(() => {
      this.rewireLoggingToElement(true)
    })
  }

  render() {
    return (
      <div id="container">
        <h3>console</h3>
        <div id="log"></div>
      </div>
    )
  }

  disconnectedCallback() {
    this.unproxyConsole('log')
    this.unproxyConsole('debug')
    this.unproxyConsole('warn')
    this.unproxyConsole('error')
    this.unproxyConsole('info')
    this.unproxyConsole('dir')
    this.unproxyConsole('table')
  }
}
