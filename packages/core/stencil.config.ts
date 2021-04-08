import { Config } from '@stencil/core'
import analyzer from 'rollup-plugin-analyzer'
import visualizer from 'rollup-plugin-visualizer'
import { JsonDocs } from './stencil.config.utils'
const config: Config = {
  namespace: 'nent',
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
      footer: `NENT 2021 - all rights reserved`,
      dependencies: true,
      strict: true,
    },
    {
      type: 'docs-vscode',
      file: 'dist/custom-elements.json',
      sourceCodeBaseUrl:
        'https://github.com/nent/nent/tree/main/packages/core/src/components/',
    },
    {
      type: 'docs-vscode',
      file: '../vscode/html.html-data.json',
    },
    JsonDocs,
    {
      type: 'docs-json',
      file: 'dist/collection/components.json',
    },
  ],
}

export { config }
