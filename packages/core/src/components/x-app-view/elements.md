# X-APP-VIEW

Child Attribute Detection & Resolution

## Install `\<x-elements\>`

```html
<x-elements></x-elements>
```

The following attributes are queried to resolve certain data-values or show/hide conditions for all child elements.

### Hide When: [x-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

```html
<any x-hide-when='predicate' />
```

### Show When: [x-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes.

```html
<any x-show-when='predicate' hidden />
```

> To initially hide the element, be sure to include the ‘hidden’ attribute.

### Conditioned Classes: [x-class-when] && [x-class]

This pair of attributes conditionally toggle the class specified in the `x-class` attribute using the `x-class-where` expression.

```html
<any x-class='class' x-class-when='predicate'></any>
```

### Value From: [x-value-from]

Input-type elements (input, textarea and select) can specify a data expression for its value. This informs the route container to update this value when it changes.

```html
<any x-class='class' x-class-when='predicate'></any>
```