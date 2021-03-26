
For more complex data shapes, you can define the data parameters as JSON in a child script tag.

```html
<n-action topic='<topic>' command='<command>'>
  <script type='application/json'>
    {
      'arg1': 'Hello world!'
    }
  </script>
</n-action>
```