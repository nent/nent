# n-view-detect

This component will conditionally display an 'active' or 'inactive' slot.  

The default slot is shown when the current route of the app does not match either the supplied `route` or `route-math` properties. Whenever a match is found, the default slot is hidden and the 'active' slot is displayed.

## Basic Usage

```html
<n-view-link path='/route' active-class='my-active-class'> ... </n-view-link>
```

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
