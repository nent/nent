
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

Or, just include it in one of the [`n-view`](/components/n-view) or [`n-view-prompt`](/components/n-view-prompt) elements. These elements remove any **defer-load** attributes on child elements once their route is activated, giving us lazy-loaded routes with this element.