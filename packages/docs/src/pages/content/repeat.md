```html
<ul>
  <n-content-repeat items="{{session:visits}}">
    <script>
      ['one', 'two', 'three']
    </script>
    <template>
      <li>{{data:item}}</li>
    </template>
  </n-content-repeat>
</ul>
```