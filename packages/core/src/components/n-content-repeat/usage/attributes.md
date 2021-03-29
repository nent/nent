The **items** attribute can be any array-string or an [expression](/data/expressions) to pull data from a registered provider.

### Items from Attribute (Simple Array)

```html
<n-content-repeat items="['one','two','three']">
  <template>
    <div>{{data:item}}</div>
  </template>
</n-content-repeat>
```

### Items from Attribute (Provider Array)

```html
<n-content-repeat items='{{storage:cart-items}}'>
  <template>
    <div>{{data:productName}}</div>
  </template>
</n-content-repeat>
```