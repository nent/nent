To add a condition to your actions, add a when attribute to the action element with your predicate expression.

```html
<n-action topic='<topic>'
  command='<command>'
  when='<expression>'
  data-(key)='value'>
</n-action>
...
<n-data></n-data>
```

> NOTE: You must enable data services, by adding an `n-data` element to the page.


#### Real example

```html
<n-action topic='navigation'
  command='go-to'
  when='{{storage:auto-navigate}}'
  data-path='/some/path'>
</n-action>
```
