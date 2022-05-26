# n-detect-route

This component will conditionally display an 'active' or 'inactive' slot.  

The default slot is shown when the current route of the app does not match either the supplied `route` or `route-match` properties. Whenever a match is found, the default slot is hidden and the 'active' slot is displayed.

## Basic Usage

```html
<n-detect-route route='/route' exact> ... </n-detect-route>
```

The above example will toggle to the active slot when the app route is exactly `/route` (no children or URL params).

## Regex 

Using the `route-match` property, you can leverage regex to match on multiple paths.

```html
<n-detect-route route-match="^\/start\/(?:.*|)?|\/end|\/bar$">...<n-detect-route>
```

The above example will toggle to the active slot when the app route is a child of start or exactly `/end` or `/bar`.

<!-- Auto Generated Below -->


## Properties

| Property             | Attribute     | Description                                                                             | Type                                                    | Default     |
| -------------------- | ------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------- |
| `exact`              | `exact`       | Only active on the exact href match, and not on child routes                            | `boolean`                                               | `false`     |
| `route` _(required)_ | `route`       | The route that will toggle the active slot of this component                            | `string`                                                | `undefined` |
| `routeMatch`         | `route-match` | Optional Regex value to route match on                                                  | `(string`, `RegExp)[]`, `RegExp`, `string`, `undefined` | `undefined` |
| `strict`             | `strict`      | Only active on the exact href match using every aspect of the URL including parameters. | `boolean`                                               | `true`      |


## Slots

| Slot        | Description                            |
| ----------- | -------------------------------------- |
| `"active"`  | content to display when route match    |
| `"default"` | content to display when no route match |


----------------------------------------------

NENT 2021 - all rights reserved
