import { Config } from '@stencil/core'
import { JsonDocs } from '@stencil/core/internal'
import analyzer from 'rollup-plugin-analyzer'
import visualizer from 'rollup-plugin-visualizer'
import { version } from './package.json'

const config: Config = {
  namespace: 'nent',
  hashFileNames: false,
  preamble: 'NENT 2022',
  invisiblePrehydration: false,
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
      copy: [
        {
          src: 'components/**/*.md',
          dest: '../../docs',
          keepDirStructure: true,
        },
      ],
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
      footer: `NENT v${version} - Copyright 2022 [all rights reserved]`,
      dependencies: true,
      strict: true,
    },
    {
      type: 'docs-vscode',
      file: 'dist/nent.html-data.json',
    },
    {
      type: 'docs-custom',
      strict: true,
      generator: (docs: JsonDocs) => {
        Object.assign(docs, { version })
      },
    },
    {
      type: 'docs-json',
      file: 'dist/components.json',
    },
    { type: 'stats' },
  ],
}

export { config }
