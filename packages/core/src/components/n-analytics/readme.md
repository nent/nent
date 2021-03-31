# N-ANALYTICS

The [\<n-analytics\>](/components/n-analytics) component delegates internal analytics commands to DOM events
allowing developers to connect events to any analytics provider.

## Actions

This component can respond to actions. See the  [actions](/components/n-analytics/actions) documentation for more information.


<!-- Auto Generated Below -->


## Usage

### GTM

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
  <n-analytics id='analytics'>
    <script>
      analytics.addEventListener('custom-event', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag(e.detail.key, e.detail.value)
      })
      analytics.addEventListener('page-view', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag('page_view', e.detail.pathname)
      })
      analytics.addEventListener('view-time', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag(e.detail.key, e.detail.value)
      })
    </script>
  </n-analytics>
</body>
```


### Basic

Using the [\<n-analytics\>](/components/n-analytics) is simple, but does require some scripting.



## Events

| Event          | Description              | Type               |
| -------------- | ------------------------ | ------------------ |
| `custom-event` | Raised analytics events. | `CustomEvent<any>` |
| `page-view`    | Page views.              | `CustomEvent<any>` |
| `view-time`    | View percentage views.   | `CustomEvent<any>` |


----------------------------------------------

NENT 2021 - all rights reserved
