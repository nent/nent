# X-DATA-DISPLAY

Render data directly into HTML using declarative expressions. This element renders the expression with all data-tokens replaced with the values provided by the provider.



<!-- Auto Generated Below -->


## Usage

### Basic

```html
<n-content-template text='{{expression}}'> </n-content-template>
```

The expression can be any string or an expression with tokens from a registered provider.

### Template Interpolation

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<n-content-template>
  <template>
    <h1>Hello {{expression}}!</h1>
  </template>
</n-content-template>
```

> This component only supports template interpolation within the **\<template\>** tag.

### Template Sample

This component supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<n-content-template>
  <template>
    <h1>Hello {{session:name}}!</h1>
  </template>
</n-content-template>
```


### Json

You can provide the data to use for this component directly in-line using a inner script tag.

```html
<n-content-template>
  <script type="text/json">
  {
    "name": "Stella",
    "age": 35
  }
  </script>
  <template>
    <h1>{{data:name}} is {{data:age}}</h1>
  </template>
</n-content-template>
```



## Properties

| Property    | Attribute    | Description                                                                                                  | Type                  | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `deferLoad` | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`             | `false`     |
| `text`      | `text`       | The data expression to obtain a value for rendering as inner-text for this element. {{session:user.name}}    | `string \| undefined` | `undefined` |


----------------------------------------------

nent 2021 - all rights reserved
