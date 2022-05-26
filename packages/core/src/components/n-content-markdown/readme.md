# N-CONTENT-MARKDOWN

This element converts markdown text to HTML. It can render from an inline-template or a remote source. 

## Styling

By default, there is no styling added to the rendered HTML, so it blends with your site's styles. 


<!-- Auto Generated Below -->


## Usage

### Data-tokens

### Resolve Tokens

This element can optionally render data-tokens directly without the need for the [\<n-content-template\>](/components/n-content-template) element. Just add the **resolve-tokens** attribute.

```html
<!-- Do not set the `src` attribute -->
<n-content-markdown resolve-tokens>
  <!-- Write your markdown -->
  <script type='text/markdown'>
    # **This** is a value from session: {{session:name}}
  </script>
</n-content-markdown>
```


### Inline

### Inline Markdown

A `<script>` tag can be inserted inside of the element to provide the markdown source. It overrides the markdown and src attributes. Support for changing this markdown source dynamically is not yet implemented.

```html
<!-- Do not set the `src` attribute -->
<n-content-markdown>
  <!-- Write your markdown inside a `<script type='text/markdown'>` tag -->
  <script type='text/markdown'>
    # **This** is my [markdown](https://example.com)
    This <button onclick="alert('JavaScript executed')">button</button> is evil
  </script>
</n-content-markdown>
```


### Remote

The `src` attribute can be used to load a markdown file through AJAX. It overrides the markdown attribute. The source can be dynamically updated to change the markdown file displayed.

```html
<!-- Simply set the `src` attribute and win -->
<n-content-markdown 
  src='https://example.com/markdown.md'>
</n-content-markdown>
```

#### Delayed Rendering

When using this element, you may want to delay the fetch until the content is needed. The **defer-load** attribute will prevent the HTML from being fetched until that attribute is removed.

```html
<n-content-markdown 
  id='markdown' 
  src='<url-to-html>' 
  defer-load> 
</n-content-markdown>
```

You can remove the attribute programmatically to force the fetch:

```javascript
const include = document.querySelector('#markdown);
include.removeAttribute('defer-load');
```

Or, just include it in one of the [\<n-view\>](/components/n-view) or [\<n-view-prompt\>](/components/n-view-prompt) elements. These elements remove any **defer-load** attributes on child elements once their route is activated, giving us lazy-loaded routes with this element.



## Properties

| Property        | Attribute        | Description                                                                                                                                                                      | Type                                                 | Default     |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `deferLoad`     | `defer-load`     | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.                                                                     | `boolean`                                            | `false`     |
| `json`          | `json`           | The JSONata expression to select the markdown from a json response. see <https://try.jsonata.org> for more info.                                                                 | `string`, `undefined`                                | `undefined` |
| `mode`          | `mode`           | Cross Origin Mode                                                                                                                                                                | `"cors"`, `"navigate"`, `"no-cors"`, `"same-origin"` | `'cors'`    |
| `noCache`       | `no-cache`       | Force render with data & route changes.                                                                                                                                          | `boolean`                                            | `false`     |
| `resolveTokens` | `resolve-tokens` | Before rendering HTML, replace any data-tokens with their resolved values. This also commands this element to re-render it's HTML for data-changes. This can affect performance. | `boolean`                                            | `false`     |
| `src`           | `src`            | Remote Template URL                                                                                                                                                              | `string`, `undefined`                                | `undefined` |
| `when`          | `when`           | A data-token predicate to advise this element when to render (useful if used in a dynamic route or if tokens are used in the 'src' attribute)                                    | `string`, `undefined`                                | `undefined` |


----------------------------------------------

NENT 2022 - all rights reserved
