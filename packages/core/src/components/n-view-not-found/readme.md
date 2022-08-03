# N-VIEW-NOT-FOUND

The `<n-view-not-found>` element should be placed at the end of the content,
inside the n-views element. It shows up when no views
above it resolve.

## Usage

Using the `<n-view-not-found>` element.

```html
<n-views>
  ... all other views ...
  <n-view-not-found ...>
    <h2>Not Found.</h2>
  </n-view-not-found>
</n-views>
```

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property          | Attribute           | Description                                                                          | Type                  | Default       |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------ | --------------------- | ------------- |
| `pageTitle`       | `page-title`        | The title for this view. This is prefixed before the app title configured in n-views | `string`              | `'Not Found'` |
| `scrollTopOffset` | `scroll-top-offset` | Header height or offset for scroll-top on this view.                                 | `number`              | `0`           |
| `transition`      | `transition`        | Navigation transition between routes. This is a CSS animation class.                 | `string`, `undefined` | `undefined`   |


----------------------------------------------

NENT v0.10.6 - Copyright 2022 [all rights reserved]
