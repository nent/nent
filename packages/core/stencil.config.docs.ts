import { Config } from '@stencil/core'
const config: Config = {
  namespace: 'nent',
  preamble: 'nent 2021',
  hashFileNames: false,
  enableCache: true,
  enableCacheStats: true,
  outputTargets: [
    {
      type: 'docs-json',
      file: '../../docs/assets/components.json',
      strict: true,
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
