# N-VIEW: Data Extension

When the [n-data](/components/n-data) system is enabled, data tokens can be used in the `src` and `content-src` attributes, as well as in the content. 

To enable token resolution, include the `resolve-tokens` attribute.

## Token Attributes

```html
<n-data></n-data>
<n-view
  src="/partials/{{route:page}}.html"
  >
</n-view>
```


## Token Content

```html
<n-data></n-data>
<n-view
  src="/partials/page.html"
  resolve-tokens>
</n-view>
```