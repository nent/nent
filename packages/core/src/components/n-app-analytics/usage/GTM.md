

```html
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script
    async
    src='https://www.googletagmanager.com/gtag/js?id=G-ZZZ'
  ></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-ZZZZ')
  </script>
</head>
<body>
  ...
  <n-app-analytics id='analytics'>
    <script>
      analytics.addEventListener( 'custom-event', ( e ) => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        Object.getOwnPropertyNames(e.detail).forEach(n => {
          gtag( n, e.detail[n] )
          console.debug(`gtag('${n}', '${e.detail[n]})'`)
        })
      } )
      analytics.addEventListener('page-view', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag('page_view', e.detail.pathname)
      })
      analytics.addEventListener('view-time', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag(e.detail.key, e.detail.value)
      })
    </script>
  </n-app-analytics>
</body>
```