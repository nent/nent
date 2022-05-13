// @ts-ignore-line
import XmlSitemap from 'xml-sitemap'
import { Command } from '@oclif/core'
import { Parser } from 'htmlparser2'
import { WritableStream } from 'htmlparser2/lib/WritableStream.js'

import {
  getFullPath,
  readFile,
  readFileStream,
  writeFile,
} from '../utils'

export default class Sitemap extends Command {
  static description = 'Generate a sitemap.xml file'

  static examples = [`$ nent sitemap ./dist`]

  static args = [
    {
      name: 'path',
      description:
        'The folder where the index file and sitemap.xml file live.',
      default: './dist',
    },
  ]

  async run(): Promise<void> {
    const { args } = await this.parse(Sitemap)
    const outputDir = args.path
    const fileStream = readFileStream(`${outputDir}/index.html`)

    fileStream
      .pipe(
        new WritableStream({
          onopentag(name, attributes) {
            getRoute(outputDir, name, attributes)
          },
        }),
      )
      .on('finish', () => {
        fileStream.close()
        const sitemap = new XmlSitemap()
        sitemap.add(routes)
        sitemap.updateAll()
        writeFile(`${outputDir}/sitemap.xml`, sitemap.xml)
      })

    // this.log(`hello ${args.person} from ${flags.from}! (./src/commands/hello/index.ts)`)
  }
}

const routes: Array<{
  url: string
  file: string
}> = []

function getRouteData(attributes: any) {
  return {
    title: attributes['page-title'],
    path: attributes.path,
    src: attributes.src,
    file: attributes['content-src'],
  }
}

function getRoute(
  outputDir: string,
  name: string,
  attributes: any,
  parent: string = '',
) {
  if (name == 'n-view' || name == 'n-view-prompt') {
    const { title, path, src, file } = getRouteData(attributes)
    const url = `${parent}${path}`.split('//').join('/')

    console.log(`Processing ${title} ${url}`)

    const data: any = {
      url,
    }

    if (file) data.file = getFullPath(`${outputDir}${file}`)

    routes.push(data)

    if (!src) return

    new Parser({
      onopentag(name, attributes) {
        getRoute(outputDir, name, attributes, url)
      },
    }).parseComplete(readFile(`${outputDir}${src}`))
    return routes
  }
}
