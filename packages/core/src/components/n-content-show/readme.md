# N-CONTENT-SHOW

This tag conditionally renders child elements based on the configured predicate applied to the when value predicate. To learn more about predicates, check out the [expressions](/data/expressions) documentation.

## Element

```html
<n-content-show 
  when='<expression>'>
  ... contents ...
</n-content-show>
```

<!-- Auto Generated Below -->


## Usage

### Basic

### Show

```html
<n-content-show 
  when='true'>
  
</n-content-show>
```

### Hide

```html
<n-content-show 
  when='false'>
  
</n-content-show>
```

### Expressions

```html
<n-content-show 
  when='1 in [1,2]'>
  ... shows! ...
</n-content-show>
```

```html
<n-content-show 
  when='3 in [1,2]'>
  ... hides! ...
</n-content-show>
```

```html
<n-content-show 
  when='5 > 4'>
  ... shows! ...
</n-content-show>
```



## Properties

| Property            | Attribute | Description                                                                                               | Type     | Default     |
| ------------------- | --------- | --------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `when` _(required)_ | `when`    | The data expression to obtain a predicate for conditionally rendering the inner-contents of this element. | `string` | `undefined` |


----------------------------------------------

NENT v0.10.6 - Copyright 2022 [all rights reserved]
