# X-APP

Child Attribute Detection & Resolution

## Install `\<n-elements\>`

```html
<n-elements></n-elements>
```

The following attributes are queried to resolve certain data-values or show/hide conditions for all child elements.

## Child Attribute Detection & Resolution

The following attributes are queried to resolve certain data-values or show/hide conditions for all child elements.

### Cloak: [n-cloak]

For each child element with this attribute, the value of the attribute is removed when this component is fully loaded. This
attribute is target in css for `display:none`.

```html
<any n-hide-when='predicate' />
```

### Hide: [n-hide]

For each child element with this attribute, the value of the attribute is removed when the XApp component is fully loaded
and replaced with `hidden`. The hidden
attribute is also a target in css for `display:none`. This
is used to hide content once the components have loaded.

```html
<any n-hide-when='predicate' />
```


#### Hide When: [n-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

```html
<any n-hide-when='predicate' />
```

#### Show When: [n-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes.

```html
<any n-show-when='predicate' hidden />
```

> To initially hide the element, be sure to include the ‘hidden’ attribute.

#### Conditioned Classes: [n-class-when] && [n-class]

This pair of attributes conditionally toggle the class specified in the `n-class` attribute using the `n-class-where` expression.

```html
<any n-class='class' n-class-when='predicate'></any>
```

#### Value From: [n-value-from]

Input-type elements (input, textarea and select) can specify a data expression for its value. This informs the route container to update this value when it changes.

```html
<any n-class='class' n-class-when='predicate'></any>
```