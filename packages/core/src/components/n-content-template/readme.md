# N-CONTENT-TEMPLATE

Render data directly into HTML using declarative expressions. This element renders the expression with all data-tokens replaced with the values provided by the provider.

## Element

```html
<n-content-template>
  <template>
    <any>{{expression}}</any>
  </template>
</n-content-template>
```

<!-- Auto Generated Below -->


## Usage

### Basic

```html
<n-content-template text='{{expression}}'> </n-content-template>
```

The expression can be any string or an expression with tokens from a registered provider.

### Template Interpolation

This element supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<n-content-template>
  <template>
    <h1>Hello {{expression}}!</h1>
  </template>
</n-content-template>
```

> This element only supports template interpolation within the **\<template\>** tag.


### Graphql

```html
<n-content-template graphql 
  src='https://content.io/graphql'
  filter="$sum(data.cart.items.(cost*count))"
  >
  <n-query data-value="{{user:id}}">
    query cart(id: $value) {
      items {
        count
        cost
      }
    }
  </n-query>
  <template>
    {{data:item}}
  </template>
  
  </n-content-template>
```

### GraphQL Response
```json
{
  "data": {
    "cart": [
      {
        "items": [
          {
            "count": 3,
            "cost": 5
          },
          {
            "count": 3,
            "cost": 8
          }
        ],
        "effective": "2022-06-01"
      }
    ]
  }
}
```

### JSON Filter transforms the response data to this:

The expression can be any string or an expression with tokens from a registered provider.

### Template Interpolation

This element supports HTML string interpolation within a child template tag. The values get resolved, just like the expression. The values in the attributes replace the tokens in the content.

```html
<n-content-template>
  <template>
    <h1>Hello {{expression}}!</h1>
  </template>
</n-content-template>
```

> This element only supports template interpolation within the **\<template\>** tag.


### Json

You can provide the data to use for this element directly in-line using a inner script tag.

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

| Property    | Attribute    | Description                                                                                                                                   | Type                                                 | Default     |
| ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `debug`     | `debug`      | Turn on debug statements for load, update and render events.                                                                                  | `boolean`                                            | `false`     |
| `deferLoad` | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.                                  | `boolean`                                            | `false`     |
| `filter`    | `filter`     | The JSONata query to filter the json items see <https://try.jsonata.org> for more info.                                                       | `string`, `undefined`                                | `undefined` |
| `graphql`   | `graphql`    | When declared, the child script tag is required and should be the query text for the request. Also, this forces the HTTP method to 'POST'.    | `boolean`                                            | `false`     |
| `mode`      | `mode`       | Cross Origin Mode                                                                                                                             | `"cors"`, `"navigate"`, `"no-cors"`, `"same-origin"` | `'cors'`    |
| `noCache`   | `no-cache`   | Force render with data & route changes.                                                                                                       | `boolean`                                            | `false`     |
| `src`       | `src`        | The URL to remote JSON data to bind to this template                                                                                          | `string`, `undefined`                                | `undefined` |
| `text`      | `text`       | The data expression to obtain a value for rendering as inner-text for this element.                                                           | `string`, `undefined`                                | `undefined` |
| `when`      | `when`       | A data-token predicate to advise this element when to render (useful if used in a dynamic route or if tokens are used in the 'src' attribute) | `string`, `undefined`                                | `undefined` |


----------------------------------------------

NENT 2022 - all rights reserved
