import { OutputTargetDocsCustom } from '@stencil/core/internal'
import { JsonDocs } from '@stencil/core/internal/stencil-public-docs'
import fs from 'fs'
import { version } from './package.json'

const badSeparatorRegEx = /\s*\\\|\s*/g

const JsonDocs: OutputTargetDocsCustom = {
  type: 'docs-custom',
  strict: true,
  generator: (docs: JsonDocs) => {
    Object.assign(docs, { version })
    docs.components.forEach(comp => {
      if (comp.readmePath) {
        let fileContents = fs.readFileSync(comp.readmePath, 'utf8')
        if (fileContents.match(badSeparatorRegEx)) {
          fileContents = fileContents.replace(
            badSeparatorRegEx,
            '`, `',
          )
          comp.readme = fileContents = fileContents
            .split('"')
            .join(`'`)

          fs.writeFileSync(comp.readmePath, fileContents)
        }
      }
    })
  },
}

export { JsonDocs }
