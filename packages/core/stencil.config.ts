import { Config } from '@stencil/core'
import analyzer from 'rollup-plugin-analyzer'
import visualizer from 'rollup-plugin-visualizer'
import { JsonDocs } from './stencil.config.utils'
const config: Config = {
  namespace: 'nent',
  preamble: 'nent 2021',
  hashFileNames: false,
  rollupPlugins: {
    after: [
      analyzer({
        summaryOnly: true,
      }),
      visualizer({
        filename: './dist/stats.html',
      }),
    ],
  },
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
