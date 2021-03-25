# X-CONTENT-MARKDOWN

This component converts markdown text to HTML. It can render from an inline-template or from a remote source.

## Usage

```html
<!-- Simply set the `src` attribute and win -->
<x-content-markdown 
  src='https://example.com/markdown.md'>
</x-content-markdown>
```

### Inline Markdown

You also use markdown inline.

```html
<!-- Do not set the `src` attribute -->
<x-content-markdown>
  <!-- Write your markdown inside a `<script type='text/markdown'>` tag -->
  <script type='text/markdown'>
    # **This** is my [markdown](https://example.com)
  </script>
</x-content-markdown>
```

### Resolve Tokens

This component can optionally render data-tokens directly without the need for the [\<x-data-display\>](/components/x-data-display) component. Just add the **resolve-tokens** attribute.

```html
<!-- Do not set the `src` attribute -->
<x-content-markdown resolve-tokens>
  <!-- Write your markdown -->
  <script type='text/markdown'>
    # **This** is a value from session: {{session:name}}
  </script>
</x-content-markdown>
```

### Delayed Rendering

When using this component, you may want to delay the fetch until the content is needed. The **defer-load** attribute will prevent the HTML from being fetched until that attribute is removed.

```html
<x-content-markdown 
  id='markdown' 
  src='<url-to-html>' 
  defer-load> 
</x-content-markdown>
```

You can remove the attribute programmatically to force the fetch:

```javascript
const include = document.querySelector('#markdown);
include.removeAttribute('defer-load');
```

Or, just include it in one of the components [\<x-app-view\>](/components/x-app-view) or [\<x-app-view-do\>](/components/x-app-view-do). These components remove any **defer-load** attributes on child elements once their route is activated, giving us lazy-loaded routes with this component.

## Styling

By default, there is no styling. The HTML is rendered to the page without styles. For basic styles, you can include the Marked.js css file in the head


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
