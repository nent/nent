
You can provide the data to use for this component directly in-line using a inner script tag.

```html
<x-data-display>
  <script type="text/json">
  {
    "name": "Stella",
    "age": 35
  }
  </script>
  <template>
    <h1>{{data:name}} is {{data:age}}</h1>
  </template>
</x-data-display>
```