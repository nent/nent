### Items from Inline Script (Object Array)

```html
<n-content-repeat>
  <script type='application/json'>
    [
      { 'color': 'blue', 'name': 'Bob' },
      { 'color': 'red', 'name': 'Sally' }
    ]
  </script>
  <template>
    <div style='color: {{data:color}};'>{{data:name}}</div>
  </template>
</n-content-repeat>
```