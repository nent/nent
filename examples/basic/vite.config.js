import { defineConfig } from 'vite'
import PurgeIcons from 'vite-plugin-purge-icons'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  server: {
    port: 3005
  },
  build: {
    emptyOutDir: true
  },
  plugins: [
    PurgeIcons(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      manifest: {
        short_name: 'NENT PWA',
        name: 'NENT PWA',
        lang: 'en-US',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#fff',
        background_color: '#000',
        icons: [
          {
            src: '/assets/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: '/assets/logo256.png',
            type: 'image/png',
            sizes: '256x256',
            purpose: 'maskable any',
          },
          {
            src: '/assets/logo512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable any',
          },
        ],
      },
      workbox: {
        // globDirectory: 'dist',
        globPatterns: ['**/*.{png,ico,html,json,txt,js,css,svg}'],
        swDest: 'sw.js',
        skipWaiting: true,
        navigationPreload: true,
        offlineGoogleAnalytics: true,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
})
