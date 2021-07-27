# N-CONTENT-REPEAT

This tag renders a template for each item in the configured array. The item template uses value expressions to insert data from any [data provider](/data/providers) as well as the item in the array.

## Element

```html
<n-content-repeat items='{{expression}}'>
  <template>
    <div>{{data}}</div>
  </template>
</n-content-repeat>
```

## Template Interpolation

This component supports HTML string interpolation within a child template tag. Each item from the configured collection will be rendered with this template.

**Data Token Format:** `{<provider>:<data-key>(?<default>)}`

**provider**: the data provider name
**data-key**: the data value key within the provider \*
**default**: optional default value if the provider's key is empty.

\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression `{{data:user.name}}` means the session value 'user' is a JSON object, parse it and replace it with the 'name' property._

> See [data](/data) for full documentation


## Items Source

This element supports three ways to express the collection or where it comes from.

<!-- Auto Generated Below -->


## Usage

### Attributes

The `items` attribute can be any array-string or an [expression](/data/expressions) to pull data from a registered provider.

### Items from Attribute (Simple Array)

```html
<n-content-repeat items="['one','two','three']">
  <template>
    <div>{{data:item}}</div>
  </template>
</n-content-repeat>
```

### Items from Attribute (Provider Array)

```html
<n-content-repeat items='{{storage:cart-items}}'>
  <template>
    <div>{{data:productName}}</div>
  </template>
</n-content-repeat>
```


### Remote

### Items from Remote URL (Remote Array)

```html
<n-content-repeat items-src='/data/items.json'>
  <template>
    <div style='color: {{data:color}};'>{{data:name}}</div>
  </template>
</n-content-repeat>
```


### Script

### Items from Inline Script (Object Array)

```html
<n-content-repeat>
  <script type='application/json'>
    [
      { 'color': 'blue', 'name': 'Bob' },
      { 'color': 'red', 'name': 'Sally' }
    ]
  </script>
  <template>
    <div style='color: {{data:color}};'>{{data:name}}</div>
  </template>
</n-content-repeat>
```



## Properties

| Property    | Attribute    | Description                                                                                                                                   | Type                  | Default     |
| ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `debug`     | `debug`      | Turn on debug statements for load, update and render events.                                                                                  | `boolean`             | `false`     |
| `deferLoad` | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.                                  | `boolean`             | `false`     |
| `filter`    | `filter`     | The JSONata query to filter the json items see <https://try.jsonata.org> for more info.                                                       | `string`, `undefined` | `undefined` |
| `items`     | `items`      | The array-string or data expression to obtain a collection for rendering the template. {{session:cart.items}}                                 | `string`, `undefined` | `undefined` |
| `itemsSrc`  | `items-src`  | The URL to remote JSON collection to use for the items.                                                                                       | `string`, `undefined` | `undefined` |
| `noCache`   | `no-cache`   | Force render with data & route changes.                                                                                                       | `boolean`             | `false`     |
| `when`      | `when`       | A data-token predicate to advise this element when to render (useful if used in a dynamic route or if tokens are used in the 'src' attribute) | `string`, `undefined` | `undefined` |


----------------------------------------------

NENT 2021 - all rights reserved
