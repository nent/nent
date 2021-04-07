# N-VIEW-PROMPT: Data Tokens

When the [n-data](/components/n-data) system is enabled, data tokens can be used in the `src` and `content-src` attributes, as well as in child elements. 

To enable token resolution in child elements include the `resolve-tokens` attribute.

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