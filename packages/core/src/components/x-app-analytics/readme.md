# X-APP-ANALYTICS

The [\<x-app-analytics\>](/components/x-app-analytics) component delegates internal analytics commands to DOM events
allowing developers to connect events to any analytics provider.

## Actions

This component can respond to actions. See 


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
  <x-app-analytics id='analytics'>
    <script>
      analytics.addEventListener('event', e => {
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
  </x-app-analytics>
</body>
```


### Basic

Using the [\<x-app-analytics\>](/components/x-app-analytics) is simple, but does require some scripting.



## Events

| Event       | Description              | Type               |
| ----------- | ------------------------ | ------------------ |
| `event`     | Raised analytics events. | `CustomEvent<any>` |
| `page-view` | Page views.              | `CustomEvent<any>` |
| `view-time` | View percentage views.   | `CustomEvent<any>` |


----------------------------------------------

nent 2021 - all rights reserved
