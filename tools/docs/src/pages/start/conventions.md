The properties of these elements are **reflected** as attributes of the corresponding tag.

Changing the value of a property changes the value of the corresponding attribute and vice-versa. There are a few exceptions, however. Some attributes are used only to set the initial value of a property and are not updated subsequently. That's the case in particular for attributes that reflect the "state" of an element, rather than its configuration. For example, the `value` property is typically not reflected. This convention is consistent with the behavior of native web elements.

Only properties of type `boolean`, `string`, or `number` are reflected as an attribute. More complex properties (for example arrays and object literals) are only available as properties.

The presence of a boolean attribute indicates the value of its property is `true`. Its absence indicates that the value of the property is `false`. The value of boolean attributes is ignored, only their presence or absence is relevant.

```html
<n-content-include>
</n-content-include>
<!-- "defer-load" is false -->

<n-content-include 
  defer-load>
</n-content-include>
<!-- "defer-load" is true -->

<n-content-include 
  defer-load="true">
</n-content-include>
<!-- "defer-load" is true -->

<n-content-include 
  defer-load="foo">
</n-content-include>
<!-- "defer-load" is true -->

<n-content-include 
  defer-load="false">
</n-content-include>
<!-- !! "defer-load" is true -->
```

