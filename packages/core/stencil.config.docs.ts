import { Config } from '@stencil/core'
import visualizer from 'rollup-plugin-visualizer'
import { JsonDocs } from './stencil.config.utils'
const config: Config = {
  namespace: 'nent',
  preamble: 'NENT 2021',
  hashFileNames: false,
  rollupPlugins: {
    after: [
      visualizer({
        filename: '../../docs/stats.html',
      }),
    ],
  },
  outputTargets: [
    {
      type: 'docs-vscode',
      file: '../../docs/assets/custom-elements.json',
    },
    JsonDocs,
    {
      type: 'docs-json',
      file: '../../docs/assets/components.json',
    },
    {
      type: 'www',
      dir: '../../docs',
      buildDir: 'js/nent',
      empty: false,
      serviceWorker: null,
      copy: [
        {
          src: 'components/**/*.{md,html}',
          dest: 'pages',
          keepDirStructure: true,
        },
      ],
    },
  ],
}

export { config }
