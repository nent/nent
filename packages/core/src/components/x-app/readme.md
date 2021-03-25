# X-APP

The root component is the base container for the view-engine and its child components. This element should contain root-level HTML that is global to every view along with [\<x-app-view\>](/components/x-app-view) components placed within any global-html.


This component is the root container for all routing. It provides an entry-point for the content-routing.

## Responsibilities

* Action Bus Delegation
* Event Bus Delegation
* Page title

For more information on routing, check out the [routing](/routing) documentation. Also, check out the [\<x-app-view\>](/components/x-app-view) and [\<x-app-view-do\>](/components/x-app-view-do) components.


<!-- Auto Generated Below -->


## Usage

### Basic

```html
<x-app>
  ...
  <x-app-view ...></x-app-view>
  <x-app-view ...></x-app-view>
  ...
</x-app>
```


### Complex

The example sets an offset for scrolling, a global page transition and has a non-default start page.

```html
<x-app app-title='Sample Site' 
  scroll-top-offset='0' 
  transition='fade-in' 
  start-url='/home' 
  >
  ...
  <x-app-view ...></x-app-view>
  <x-app-view ...></x-app-view>
  ...
</x-app>
```



## Properties

| Property              | Attribute           | Description                                                                                                                  | Type                  | Default     |
| --------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appTitle`            | `app-title`         | This is the application / site title. If the views or dos have titles, this is added as a suffix.                            | `string`, `undefined` | `undefined` |
| `debug`               | `debug`             | Turn on debugging to get helpful messages from the routing, data and action systems.                                         | `boolean`             | `false`     |
| `root`                | `root`              | This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths. | `string`              | `'/'`       |
| `router` _(required)_ | --                  | This is the router service instantiated with this component.                                                                 | `RouterService`       | `undefined` |
| `scrollTopOffset`     | `scroll-top-offset` | Header height or offset for scroll-top on this and all views.                                                                | `number`, `undefined` | `undefined` |
| `startUrl`            | `start-url`         | This is the start path a user should land on when they first land on this app.                                               | `string`              | `'/'`       |
| `transition`          | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                         | `string`, `undefined` | `undefined` |


## Events

| Event       | Description                                                                                                                | Type               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `x:actions` | These events are **`<x-app>`** command-requests for action handlers to perform tasks. Any handles should cancel the event. | `CustomEvent<any>` |
| `x:events`  | Listen for events that occurred within the **`<x-app>`** system.                                                           | `CustomEvent<any>` |


----------------------------------------------

nent 2021 - all rights reserved
