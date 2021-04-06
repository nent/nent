# N-CONTENT-SHOW: Data Extension

When the [n-data](/components/n-data) system is enabled, data tokens can be used in the `when` attribute. 

## When Attribute

```html
<n-data></n-data>
<n-content-show
  when="{{provider:key}} == 'some-value'"
  >
  ... content ...
</n-content-show>
```