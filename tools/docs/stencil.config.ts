import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
const config: Config = {
  namespace: 'docs',
  excludeUnusedDependencies: true,
  preamble: 'NENT 2021',
  globalStyle: 'src/index.scss',
  plugins: [
    sass(),
    // postcss({
    //   plugins: [
    //     purgecss({
    //       content: ['src/index.html', 'src/pages/**/*.html'],
    //     }),
    //   ],
    // }),
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
      serviceWorker: {
        globPatterns: [
          '**/*.{ico,wav,txt,js,css,json,html,md,png,svg}',
        ],
        swSrc: 'src/service-worker.ts',
        swDest: 'sw.js',
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
        {
          src: '_redirects',
        },
        {
          src: 'robots.txt',
        },
      ],
    },
  ],
}

export { config }
