import { Config } from '@stencil/core'
/// import analyzer from 'rollup-plugin-analyzer'
import { JsonDocs } from './stencil.config.utils'
const config: Config = {
  namespace: 'nent',
  preamble: 'nent 2021',
  hashFileNames: false,
  enableCache: true,
  enableCacheStats: true,
  //rollupPlugins: {
  //  after: [
  //    analyzer({
  //      summaryOnly: true,
  //    }),
  //  ],
  //},
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: 'loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      footer: `nent 2021 - all rights reserved`,
      dependencies: true,
      strict: true,
    },
    {
      type: 'docs-vscode',
      file: 'dist/custom-elements/custom-elements.json',
    },
    JsonDocs,
    {
      type: 'docs-json',
      file: 'dist/collection/components.json',
    },
  ],
}

export { config }
