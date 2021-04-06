# N-CONTENT-TEMPLATE: Data Extension

When the [n-data](/components/n-data) system is enabled, data tokens can be used in template. 

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<n-data>
  <n-data-session></n-data-session>
</n-data>
<n-content-template>
  <template>
    <h1>Hello {{session:name}}!</h1>
  </template>
</n-content-template>
```
