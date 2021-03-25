# X-DATA-DISPLAY

Render data directly into HTML using declarative expressions. This element renders the expression with all data-tokens replaced with the values provided by the provider.

## Usage

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

**Data Token Format:** `{<provider>:<data-key>(?<default>)}`

**provider**: the data provider name
**data-key**: the data value key within the provider \*
**default**: optional default value if the provider's key is empty.

\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression `{{session:user.name}}` means the session value 'user' is a JSON object, parse it and replace with the 'name' property._

> See [data expressions](/data/expressions) for full documentation

**Providers:**

* **session**: Browser Session
* **storage**: Browser Storage
* **cookie**: Cookies
* **route**: Route
* **query**: Query
* **data**: Inline Data

> See [data providers](/data/providers) to learn how to add custom data providers.

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property    | Attribute    | Description                                                                                                  | Type                  | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `deferLoad` | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`             | `false`     |
| `text`      | `text`       | The data expression to obtain a value for rendering as inner-text for this element. {{session:user.name}}    | `string`, `undefined` | `undefined` |


----------------------------------------------

nent 2021 - all rights reserved
