
```html
<n-content-data text='{{expression}}'> </n-content-data>
```

The expression can be any string or an expression with tokens from a registered provider.

### Template Interpolation

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<n-content-data>
  <template>
    <h1>Hello {{expression}}!</h1>
  </template>
</n-content-data>
```

> This component only supports template interpolation within the **\<template\>** tag.

### Template Sample

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<n-content-data>
  <template>
    <h1>Hello {{session:name}}!</h1>
  </template>
</n-content-data>
```
