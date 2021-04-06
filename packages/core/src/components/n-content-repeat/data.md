# N-CONTENT-REPEAT: Data Extension

When the [n-data](/components/n-data) system is enabled, data tokens can be used in the `items-src` attribute, as well as in the script child element. 


## Token Attribute

```html
<n-data></n-data>
<n-content-repeat
  items-src="{{storage:visits}}"
  >
   <template>
    <div>{{data}}</div>
  </template>
</n-content-repeat>
```


## Token JSON

```html
<n-data></n-data>
<n-content-repeat>
  <script type="application/json">
  {{storage:visits}}
  </script>
  <template>
    <div>{{data}}</div>
  </template>
</n-content-repeat>
```
