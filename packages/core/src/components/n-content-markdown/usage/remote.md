
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

Or, just include it in one of the [`n-view`](/components/n-view) or [`n-view-prompt`](/components/n-view-prompt) elements. These elements remove any **defer-load** attributes on child elements once their route is activated, giving us lazy-loaded routes with this element.