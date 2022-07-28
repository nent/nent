import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import postcss from 'postcss'
import purgecss from '@fullhuman/postcss-purgecss'
import tailwindcss from 'tailwindcss'

const config: Config = {
  namespace: 'docs',
  excludeUnusedDependencies: true,
  preamble: 'NENT 2022',
  globalStyle: 'src/index.scss',
  hashFileNames: true,
  invisiblePrehydration: false,
  plugins: [
    sass(),
    postcss([
      tailwindcss({
        content: [
          'src/**/*.html'
        ],
        darkMode: 'class',
        theme: {},
      }),
      purgecss({
        content: ['src/index.html', 'src/pages/**/*.html'],
      }),
    ]),
    ,
  ],
  devServer: {
    port: 3002,
    root: '../../docs',
    openBrowser: false,
    reloadStrategy: 'pageReload',
  },
  outputTargets: [
    {
      type: 'www',
      dir: '../../docs',
      buildDir: 'lib',
      empty: false,
      baseUrl: 'https://nent.dev',
      prerenderConfig: './prerender.config.ts',
      serviceWorker: null,
      indexHtml: 'index.html',
      copy: [
        {
          src: 'pages',
          dest: '.',
          keepDirStructure: true,
        },
        {
          src: 'examples',
          dest: '.',
          keepDirStructure: true,
        },
        {
          src: 'serve.json',
        },
        {
          src: '_redirects',
        },
        {
          src: 'robots.txt',
        },
        {
          src: 'favicon.ico',
        },
      ],
    },
  ],
}

export { config }
