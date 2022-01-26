// @ts-nocheck
self.importScripts('/workbox-v6.4.2/workbox-sw.js')

const { skipWaiting, clientsClaim } = workbox.core
const { registerRoute, setDefaultHandler, NavigationRoute } =
  workbox.routing
const { CacheableResponsePlugin } = workbox.cacheableResponse
const { ExpirationPlugin } = workbox.expiration
const {
  precacheAndRoute,
  createHandlerBoundToURL,
  cleanupOutdatedCaches,
} = workbox.precaching

const { CacheFirst, NetworkFirst, StaleWhileRevalidate } =
  workbox.strategies

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()

const OFFLINE_VERSION = 1
const CACHE_NAME = 'app'
const SHELL_URL = 'index.html'

precacheAndRoute(self.__WB_MANIFEST)

precacheAndRoute([
  {
    url: 'https://cdn.jsdelivr.net/npm/expr-eval@2.0.2/dist/bundle.min.js',
    revision: null,
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/jsonata@1.8.4/jsonata.min.js',
    revision: null,
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/remarkable@2.0.1/dist/remarkable.min.js',
    revision: null,
  },
])

registerRoute(
  ({ url }) =>
    (url.origin === 'https://cdn.jsdelivr.net') |
    (url.origin === 'https://storage.googleapis.com') |
    (url.origin === 'https://fonts.gstatic.com') |
    (url.origin === 'https://via.placeholder.com') |
    (url.origin === 'https://www.google-analytics.com') |
    (url.origin === 'https://www.googletagmanager.com'),
  new StaleWhileRevalidate({
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
  new RegExp('/lib/.+'),
  new StaleWhileRevalidate({
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
)

self.addEventListener('install', async () => {
  const cache = await caches.open(CACHE_NAME)
  // Setting {cache: 'reload'} in the new request will ensure that the response
  // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
  await cache.add(new Request(SHELL_URL, { cache: 'reload' }))
})

//self.addEventListener('fetch', event => {
//  if (event.request.mode === 'navigate') {
//    event.respondWith(async () => {
//      try {
//        // First, try to use the navigation preload response if it's supported.
//        const preloadResponse = await event.preloadResponse
//        if (preloadResponse) {
//          return preloadResponse
//        }
//
//        const networkResponse = await fetch(event.request)
//        return networkResponse
//      } catch (error) {
//        // catch is only triggered if an exception is thrown, which is likely
//        // due to a network error.
//        // If fetch() returns a valid HTTP response with a response code in
//        // the 4xx or 5xx range, the catch() will NOT be called.
//        console.log(
//          'Fetch failed; returning offline page instead.',
//          error,
//        )
//
//        const cache = await caches.open(CACHE_NAME)
//        const cachedResponse = await cache.match(SHELL_URL)
//        return cachedResponse
//      }
//    })
//  }
//})

//const handler = createHandlerBoundToURL('/index.html')
//const navigationRoute = new NavigationRoute(handler)
//registerRoute(navigationRoute)
