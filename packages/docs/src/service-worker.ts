// @ts-nocheck
self.importScripts('/workbox-v6.1.2/workbox-sw.js')
const { skipWaiting, clientsClaim } = workbox.core
const {
  registerRoute,
  setDefaultHandler,
  NavigationRoute,
} = workbox.routing
const { CacheableResponsePlugin } = workbox.cacheableResponse
// Used to limit entries in cache, remove entries after a certain period of time
const { ExpirationPlugin } = workbox.expiration
const {
  precacheAndRoute,
  createHandlerBoundToURL,
} = workbox.precaching

const {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} = workbox.strategies

self.skipWaiting()
clientsClaim()

const OFFLINE_VERSION = 1
const CACHE_NAME = 'app'
// Customize this with a different URL if needed.
const SHELL_URL = 'index.html'

const googleAnalytics = workbox.googleAnalytics

googleAnalytics.initialize()
precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({ url }) =>
    (url.origin === 'https://cdn.jsdelivr.net') |
    (url.origin === 'https://storage.googleapis.com') |
    (url.origin === 'https://fonts.gstatic.com'),
  new CacheFirst({
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
)

registerRoute(
  new RegExp('/pages/.+'),
  new StaleWhileRevalidate({
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
)
registerRoute(
  new RegExp('/assets/.+'),
  new StaleWhileRevalidate({
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
)
registerRoute(
  new RegExp('/.*.js$'),
  new StaleWhileRevalidate({
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
)

const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler)
registerRoute(navigationRoute)

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      // Setting {cache: 'reload'} in the new request will ensure that the response
      // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
      await cache.add(new Request(SHELL_URL, { cache: 'reload' }))
    })(),
  )
})

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse
          if (preloadResponse) {
            return preloadResponse
          }

          const networkResponse = await fetch(event.request)
          return networkResponse
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.log(
            'Fetch failed; returning offline page instead.',
            error,
          )

          const cache = await caches.open(CACHE_NAME)
          const cachedResponse = await cache.match(SHELL_URL)
          return cachedResponse
        }
      })(),
    )
  }
})
