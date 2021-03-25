
```html
<x-data-display text='{{expression}}'> </x-data-display>
```

The expression can be any string or an expression with tokens from a registered provider.

### Template Interpolation

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<x-data-display>
  <template>
    <h1>Hello {{expression}}!</h1>
  </template>
</x-data-display>
```

> This component only supports template interpolation within the **\<template\>** tag.

### Template Sample

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<x-data-display>
  <template>
    <h1>Hello {{session:name}}!</h1>
  </template>
</x-data-display>
```
