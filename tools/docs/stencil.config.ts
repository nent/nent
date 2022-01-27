import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import postcss from 'postcss'
import purgecss from '@fullhuman/postcss-purgecss'
import tailwindcss from 'tailwindcss'
import { Workbox } from '@stencil/core/internal'

const pkg = require('./package.json')
const config: Config = {
  namespace: 'docs',
  excludeUnusedDependencies: true,
  preamble: 'NENT 2021',
  globalStyle: 'src/index.scss',
  plugins: [
    sass(),
    postcss([
      tailwindcss({
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
      serviceWorker: {
        globPatterns: [
          '**/*.{ico,wav,txt,js,css,json,html,md,png,svg}',
        ],
        globDirectory: '../../docs',
        swDest: 'sw.js',
        skipWaiting: false,
        sourcemap: false,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        offlineGoogleAnalytics: true,
        runtimeCaching: [
          {
            urlPattern: /\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'data',
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: pkg.version + '-runtime',
            },
          },
          {
            urlPattern: ({ url }: any): boolean =>
              url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'font-stylesheets',
            },
          },
          {
            urlPattern: ({ url }: any): boolean =>
              url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-static',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
              },
            },
          },
          {
            urlPattern: ({ request }: any): boolean =>
              request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              precacheFallback: {
                fallbackURL: '/index.html',
              },
            },
          },
        ],
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
