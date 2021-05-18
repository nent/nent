# N-ANALYTICS

The [\<n-app-analytics\>](/components/n-app-analytics) component delegates internal analytics commands to DOM events
allowing developers to connect events to any analytics provider.

## Actions

This component can respond to actions. See the  [actions](/components/n-app-analytics/actions) documentation for more information.


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


### Basic

Using the [\<n-app-analytics\>](/components/n-app-analytics) is simple, but does require some scripting.



## Properties

| Property | Attribute | Description                                                                               | Type      | Default |
| -------- | --------- | ----------------------------------------------------------------------------------------- | --------- | ------- |
| `debug`  | `debug`   | Turn on debugging to get helpful messages from the app, routing, data and action systems. | `boolean` | `false` |


## Events

| Event          | Description              | Type                            |
| -------------- | ------------------------ | ------------------------------- |
| `custom-event` | Raised analytics events. | `CustomEvent<any>`              |
| `page-view`    | Page views.              | `CustomEvent<LocationSegments>` |
| `view-time`    | View percentage views.   | `CustomEvent<ViewTime>`         |


----------------------------------------------

NENT 2021 - all rights reserved
