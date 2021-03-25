
### Resolve Tokens

This component can optionally render data-tokens directly without the need for the [\<x-data-display\>](/components/x-data-display) component. Just add the **resolve-tokens** attribute.

```html
<!-- Do not set the `src` attribute -->
<x-content-markdown resolve-tokens>
  <!-- Write your markdown -->
  <script type='text/markdown'>
    # **This** is a value from session: {{session:name}}
  </script>
</x-content-markdown>
```