# N-CONTENT-MARKDOWN: Data

When the [n-data](/components/n-data) system is enabled, data tokens can be used in the `src` attribute, as well as in the inline markdown script child. 

To enable token resolution in child elements, include the `resolve-tokens` attribute.

## Token Attributes

```html
<n-data></n-data>
<n-content-markdown
  src="/partials/{{route:page}}.html"
  >
</n-content-markdown>
```


## Token Content

```html
<n-data></n-data>
<n-content-markdown
  resolve-tokens>
  <script type="text/markdown">
  <p>{{provide:item}}</p>
  </script>
</n-content-markdown>
```