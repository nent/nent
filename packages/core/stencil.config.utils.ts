import { OutputTargetDocsCustom } from '@stencil/core/internal'
import { JsonDocs } from '@stencil/core/internal/stencil-public-docs'
import { version } from './package.json'

const JsonDocs: OutputTargetDocsCustom = {
  type: 'docs-custom',
  strict: true,
  generator: (docs: JsonDocs) => {
    Object.assign(docs, { version })
  },
}

export { JsonDocs }
