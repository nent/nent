# X-VIEW-NOT-FOUND

The `<x-app-view-not-found>` should be placed at the end of the content,
inside the x-app component. It shows up when no views
above it resolve.

## Usage

Using the `<x-app-view-not-found>` component .

```html
<x-app>
  ... all other views ...
  <x-app-view-not-found ...>
    <h2>Not Found.</h2>
  </x-app-view-not-found>
</x-app>
```

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property              | Attribute           | Description                                                                        | Type                  | Default       |
| --------------------- | ------------------- | ---------------------------------------------------------------------------------- | --------------------- | ------------- |
| `pageTitle`           | `page-title`        | The title for this view. This is prefixed before the app title configured in x-app | `string`              | `'Not Found'` |
| `router` _(required)_ | --                  | The router-service instance  (internal)                                            | `RouterService`       | `undefined`   |
| `scrollTopOffset`     | `scroll-top-offset` | Header height or offset for scroll-top on this view.                               | `number`              | `0`           |
| `transition`          | `transition`        | Navigation transition between routes. This is a CSS animation class.               | `string`, `undefined` | `undefined`   |


----------------------------------------------

nent 2021 - all rights reserved
