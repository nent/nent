# N-VIEW-PROMPT: Data Extension

When the [n-data](/components/n-data) system is enabled, data tokens can be used in the `content-src` attribute, as well as in the content. 

To enable token resolution, include the `resolve-tokens` attribute.

## Token Attributes

```html
<n-data></n-data>
<n-view-prompt
  src="/partials/{{route:page}}.html"
  >
</n-view-prompt>
```


## Token Content

```html
<n-data></n-data>
<n-view-prompt
  src="/partials/page.html"
  resolve-tokens>
</n-view-prompt>
```