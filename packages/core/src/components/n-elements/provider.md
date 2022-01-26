# N-ELEMENTS: Data Provider

This provider allows templates to include data from elements using the element's ID

Provider Key: **elements**

## Installation

The elements provider is registered using the elements element **[\<n-elements\>](/components/n-elements)**.

The only value expression, relies on the ID of the element for which we want the data: `{{elements:<element-id>}}`


```html
<n-elements>
</n-elements>
<input id="name" value="Dave"/>
<p>{{elements:name}}</p>
```

would produce:

```html
<p>Dave</p>
```