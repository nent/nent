import purgecss from '@fullhuman/postcss-purgecss'
import { Config } from '@stencil/core'
import { postcss } from '@stencil/postcss'
import { sass } from '@stencil/sass'
const config: Config = {
  namespace: 'docs',
  excludeUnusedDependencies: true,
  preamble: 'nent 2021',
  globalStyle: 'src/index.scss',
  plugins: [
    sass(),
    postcss({
      plugins: [
        purgecss({
          content: ['src/index.html', 'src/pages/**/*.html'],
        }),
      ],
    }),
  ],
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload',
    port: 3002,
    gzip: true,
    root: '../../docs',
  },
  outputTargets: [
    {
      type: 'www',
      dir: '../../docs',
      buildDir: 'js/docs',
      empty: false,
      serviceWorker: {
        globPatterns: [
          '**/*.{ico,wav,txt,js,css,json,html,md,png,svg}',
        ],
        swSrc: 'src/service-worker.ts',
      },
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
      ],
    },
  ],
}

export { config }
