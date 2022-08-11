
### Resolve Tokens

This element can optionally render data-tokens directly without the need for the [`n-content-template`](/components/n-content-template) element. Just add the **resolve-tokens** attribute.

```html
<!-- Do not set the `src` attribute -->
<n-content-markdown resolve-tokens>
  <!-- Write your markdown -->
  <script type='text/markdown'>
    # **This** is a value from session: {{session:name}}
  </script>
</n-content-markdown>
```