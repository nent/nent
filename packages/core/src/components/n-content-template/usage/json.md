
You can provide the data to use for this element directly in-line using a inner script tag.

```html
<n-content-template>
  <script type="text/json">
  {
    "name": "Stella",
    "age": 35
  }
  </script>
  <template>
    <h1>{{data:name}} is {{data:age}}</h1>
  </template>
</n-content-template>
```