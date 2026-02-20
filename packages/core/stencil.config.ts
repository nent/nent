import { Config } from '@stencil/core'
import { JsonDocs } from '@stencil/core/internal'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import analyzer from 'rollup-plugin-analyzer'
import { version } from './package.json'

// rollup-plugin-visualizer v6+ is ESM-only; load via direct file path to
// support CJS contexts (Node 22+ synchronous ESM require).
function loadVisualizer(): (opts?: any) => any {
  let dir: string = __dirname
  while (dir !== dirname(dir)) {
    const candidate = join(
      dir,
      'node_modules/rollup-plugin-visualizer/dist/plugin/index.js',
    )
    if (existsSync(candidate)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require(candidate)
        return mod.visualizer || mod.default
      } catch {
        break
      }
    }
    dir = dirname(dir)
  }
  return () => ({ name: 'visualizer-noop' })
}

const visualizer = loadVisualizer()

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
