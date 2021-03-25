# X-CONTENT

This component fetches remote HTML and renders it safely and directly into the page when when and where you tell it too, as soon as it renders.

## Usage


<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property           | Attribute        | Description                                                                                                                                                                        | Type                                                 | Default     |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `deferLoad`        | `defer-load`     | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.                                                                       | `boolean`                                            | `false`     |
| `mode`             | `mode`           | Cross Origin Mode                                                                                                                                                                  | `'cors'`, `'navigate'`, `'no-cors'`, `'same-origin'` | `'cors'`    |
| `resolveTokens`    | `resolve-tokens` | Before rendering HTML, replace any data-tokens with their resolved values. This also commands this component to re-render it's HTML for data-changes. This can affect performance. | `boolean`                                            | `true`      |
| `src` _(required)_ | `src`            | Remote Template URL                                                                                                                                                                | `string`                                             | `undefined` |
| `when`             | `when`           | A data-token predicate to advise this component when to render (useful if used in a dynamic route or if tokens are used in the 'src' attribute)                                    | `string`, `undefined`                                | `undefined` |


----------------------------------------------

nent 2021 - all rights reserved
