# N-ELEMENTS


Child Attribute Detection & Resolution

## Install `<n-elements\>`

```html
<n-elements></n-elements>
```

## [n-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data changes.

```html
<any n-hide-when='predicate' />
```

## [n-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data changes.

```html
<any n-show-when='predicate' hidden />
```

> ℹ️ Note: To initially hide the element, be sure to include the ‘hidden’ attribute.

## Conditioned Classes: [n-class-when] && [n-class]

This pair of attributes conditionally toggle the class specified in the `n-class` attribute using the `n-class-where` expression.

```html
<any n-class='class' 
  n-class-when='predicate'></any>
```

## Value From: [n-value-from]

Input-type elements (input, textarea, and select) can specify a data expression for its value. This informs the route container to update this value when it changes.

```html
<any n-class='class' n-class-when='predicate'></any>
```

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property | Attribute | Description                                                  | Type      | Default |
| -------- | --------- | ------------------------------------------------------------ | --------- | ------- |
| `debug`  | `debug`   | Turn on debug statements for load, update and render events. | `boolean` | `false` |


----------------------------------------------

NENT 2022 - all rights reserved
