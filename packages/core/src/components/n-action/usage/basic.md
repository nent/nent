
For most action-argument data, it is easiest to specify them as key-value pairs using the `data-*` attributes within the `n-action` tag. The name of the argument should be prefixed with `data-`. A

```html
<n-action topic='<topic>'
  command='<command>'
  data-(key)='value'>
</n-action>
```

> NOTE: If a listener declares an argument using 'camelCase', it should be converted to 'kebab-case' in HTML, (words separated by dashes, all lowercase). It will be converted to 'camelCase' automatically when activated.


#### Real example

```html
<n-action topic='navigation'
  command='go-to'
  data-path='/some/path'>
</n-action>
```
