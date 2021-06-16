# N-APP

This component enables application installation features for progressive web applications.

It also handles event/action delegation between the HTML DOM and NENT bus.

Additionally, this element is required to add external components that need to be activated using actions.

## Element Description

```html
<n-app
  name=""
  short-name=""
  description="" 
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





## Properties

| Property   | Attribute   | Description                                                                                       | Type                  | Default     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appTitle` | `app-title` | This is the application / site title. If the views or dos have titles, this is added as a suffix. | `string`, `undefined` | `undefined` |
| `debug`    | `debug`     | Turn on debugging to get helpful messages from the app, routing, data and action systems.         | `boolean`             | `false`     |


## Events

| Event          | Description                                                                                                           | Type               |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `nent:actions` | These events are command-requests for action handlers to perform tasks. Any outside handlers should cancel the event. | `CustomEvent<any>` |
| `nent:events`  | Listen for events that occurred within the nent event system.                                                         | `CustomEvent<any>` |


----------------------------------------------

NENT 2021 - all rights reserved
