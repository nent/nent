# X-CONTENT-MARKDOWN

This component converts markdown text to HTML. It can render from an inline-template or from a remote source. 

## Styling

By default, there is no styling added to the rendered HTML, so it blends with your site's styles. 


<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property        | Attribute        | Description                                                                                                                                                                        | Type                                                 | Default     |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `deferLoad`     | `defer-load`     | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.                                                                       | `boolean`                                            | `false`     |
| `mode`          | `mode`           | Cross Origin Mode                                                                                                                                                                  | `'cors'`, `'navigate'`, `'no-cors'`, `'same-origin'` | `'cors'`    |
| `noCache`       | `no-cache`       | Force render with data & route changes.                                                                                                                                            | `boolean`                                            | `false`     |
| `resolveTokens` | `resolve-tokens` | Before rendering HTML, replace any data-tokens with their resolved values. This also commands this component to re-render it's HTML for data-changes. This can affect performance. | `boolean`                                            | `false`     |
| `src`           | `src`            | Remote Template URL                                                                                                                                                                | `string`, `undefined`                                | `undefined` |
| `when`          | `when`           | A data-token predicate to advise this component when to render (useful if used in a dynamic route or if tokens are used in the 'src' attribute)                                    | `string`, `undefined`                                | `undefined` |


----------------------------------------------

nent 2021 - all rights reserved
