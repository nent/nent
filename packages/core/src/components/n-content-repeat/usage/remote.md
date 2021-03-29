
### Items from Remote URL (Remote Array)

```html
<n-content-repeat items-src='/data/items.json'>
  <template>
    <div style='color: {{data:color}};'>{{data:name}}</div>
  </template>
</n-content-repeat>
```