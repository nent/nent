# N-APP

This element enables application installation features for progressive web applications.

It also handles event/action delegation between the HTML DOM and NENT bus.

Additionally, this element is required to add external elements that need to be activated using actions.

## Element Description

```html
<n-app
  name=""
  description="" 
  keywords=""
  short-name=""
  icon-src=""
  theme-color=""
  background-color=""
  
  disable-manifest
  disable-meta-tags
  disable-actions
  debug>
</n-app>
```


<!-- Auto Generated Below -->


## Usage

### Basic

```html
<n-app id="app"
    app-title="NENT"
    app-description="Functional elements to super-charge your HTML"
    app-keywords="web-components, low-code, no-framework, jam-stack, nent">
    ...
</n-app
```



## Properties

| Property         | Attribute         | Description                                                                                | Type                  | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `appDescription` | `app-description` | This is the application default page description.                                          | `string`, `undefined` | `undefined` |
| `appKeywords`    | `app-keywords`    | This is the application default page keywords.                                             | `string`, `undefined` | `undefined` |
| `appTitle`       | `app-title`       | This is the application / site title. If the views have titles, this is added as a suffix. | `string`, `undefined` | `undefined` |
| `debug`          | `debug`           | Turn on debugging to get helpful messages from the app, routing, data and action systems.  | `boolean`             | `false`     |


## Events

| Event          | Description                                                                                                           | Type               |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `nent:actions` | These events are command-requests for action handlers to perform tasks. Any outside handlers should cancel the event. | `CustomEvent<any>` |
| `nent:events`  | Listen for events that occurred within the nent event system.                                                         | `CustomEvent<any>` |


----------------------------------------------

NENT 2022 - all rights reserved
