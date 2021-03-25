
For more complex data shapes, you can define the data parameters as JSON in a child script tag.

```html
<x-action topic='<topic>' command='<command>'>
  <script type='application/json'>
    {
      'arg1': 'Hello world!'
    }
  </script>
</x-action>
```