
For most action-argument data, it is easies to specify them as key-value pairs using the `data-*` attributes within the `x-action` tag. The name of the argument should be prefixed with `data-`. A

```html
<x-action topic='<topic>'
  command='<command>'
  data-(key)='value'>
</x-action>
```

> NOTE: If a listener declares an argument using 'camelCase', it should be converted to 'kebab-case' in HTML, (words separated by dashes, all lowercase). It will be converted to 'camelCase' automatically when activated.


#### Real example

```html
<x-action topic='navigation'
  command='go-to'
  data-path='/some/path'>
</x-action>
```
