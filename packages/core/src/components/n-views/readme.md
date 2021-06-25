# N-VIEWS

The root component is the base container for the view-engine and its child components. This element should contain root-level HTML that is global to every view along with [\<n-view\>](/components/n-view) components placed within any global HTML.


This component is the root container for all routing. It provides an entry-point for the content-routing.

For more routing information, check out the [routing](/routing) documentation. 

<!-- Auto Generated Below -->


## Usage

### Basic

```html
<n-views>
  ...
  <n-view ...></n-view>
  <n-view ...></n-view>
  ...
</n-views>
```


### Complex

The example sets an offset for scrolling, a global page transition and has a non-default start page.

```html
<n-views app-title='Sample Site' 
  scroll-top-offset='0' 
  transition='fade-in' 
  start-path='/home' 
  >
  ...
  <n-view ...></n-view>
  <n-view ...></n-view>
  ...
</n-views>
```



## Properties

| Property          | Attribute           | Description                                                                                                                  | Type                  | Default     |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `root`            | `root`              | This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths. | `string`              | `'/'`       |
| `scrollTopOffset` | `scroll-top-offset` | Header height or offset for scroll-top on this and all views.                                                                | `number`, `undefined` | `undefined` |
| `startDelay`      | `start-delay`       | Delay redirecting to the start path by this value in seconds.                                                                | `number`              | `0`         |
| `startPath`       | `start-path`        | This is the start path a user should land on when they first land on this app.                                               | `string`, `undefined` | `undefined` |
| `transition`      | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                         | `string`, `undefined` | `undefined` |


----------------------------------------------

NENT 2021 - all rights reserved
