# N-APP: Element Extension

## Install `<n-elements>`

```html
<n-elements></n-elements>
```

## Child Attribute Detection & Resolution

### Cloak until loaded: [n-cloak]

For each child element with this attribute, the value of the attribute is removed when this component is fully loaded. Use this to hide elements until NENT is loaded. This is an attribute-target in CSS with `display: none`.

Add this to the page head:
```css
[hidden], [n-cloak] { display: none;}
```

```html
<any n-cloak />
```

### Hide once loaded: [n-hide]

For each child element with this attribute, the value of the attribute is removed when this component is fully loaded and a
hidden attribute is added. Effectively showing something until NENT is loaded and hiding it after. 

```html
<any n-hide />
```
