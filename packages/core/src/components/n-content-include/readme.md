# N-CONTENT-INCLUDE

This element fetches remote HTML and renders it safely and directly into the page when and where you tell it too, as soon as it renders.

<!-- Auto Generated Below -->


## Usage

### Basic

```html
<n-content-include src='url-to-file'> 
</n-content-include>
```

### Delayed Rendering

When using this element, you may want to delay the fetch until the content is needed. The **defer-load** attribute will prevent the HTML from being fetched until that attribute is removed.

```html
<n-content-include id='include' 
  src='<url-to-html>' 
  defer-load> </n-content-include>
```

You can remove the attribute programmatically to force the fetch:

```javascript
const include = document.querySelector('#include);
include.removeAttribute('defer-load');
```

Or, just include it in one of the [\<n-view\>](/components/n-view) or [\<n-view-prompt\>](/components/n-view-prompt) elements. These elements remove any **defer-load** attributes on child elements once their route is activated, giving us lazy-loaded routes with this element.



## Properties

| Property           | Attribute        | Description                                                                                                                                                                      | Type                                                 | Default     |
| ------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `deferLoad`        | `defer-load`     | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.                                                                     | `boolean`                                            | `false`     |
| `mode`             | `mode`           | Cross Origin Mode                                                                                                                                                                | `"cors"`, `"navigate"`, `"no-cors"`, `"same-origin"` | `'cors'`    |
| `resolveTokens`    | `resolve-tokens` | Before rendering HTML, replace any data-tokens with their resolved values. This also commands this element to re-render it's HTML for data-changes. This can affect performance. | `boolean`                                            | `false`     |
| `src` _(required)_ | `src`            | Remote Template URL                                                                                                                                                              | `string`                                             | `undefined` |
| `when`             | `when`           | A data-token predicate to advise this element when to render (useful if used in a dynamic route or if tokens are used in the 'src' attribute)                                    | `string`, `undefined`                                | `undefined` |


----------------------------------------------

NENT 2021 - all rights reserved
