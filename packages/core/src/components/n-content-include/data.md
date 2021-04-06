# N-CONTENT-INCLUDE: Data Extension

When the [n-data](/components/n-data) system is enabled, data tokens can be used in the `src` attribute, as well as in the remote file contents. 

To enable token resolution, include the `resolve-tokens` attribute.

## Token Attributes

```html
<n-data></n-data>
<n-content-include
  src="/partials/{{route:page}}.html"
  >
</n-content-include>
```

## Token Content

```html
<n-data></n-data>
<n-content-include
  src="/partials/page.html"
  resolve-tokens>

</n-content-include>
```