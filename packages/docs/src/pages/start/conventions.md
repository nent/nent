### Conventions

The properties of these elements are **reflected** as attributes of the corresponding tag.

Changing the value of a property changes the value of the corresponding attribute and vice-versa. There are a few exceptions, however. Some attributes are used only to set the initial value of a property and are not updated subsequently. That's the case in particular for attributes that reflect the "state" of an element, rather than its configuration. For example, the `value` property is typically not reflected. This convention is consistent with the behavior of native web elements.

Only properties of type `boolean`, `string` or `number` are reflected as an attribute. More complex properties (for example arrays and object literals) are only available as properties.

The presence of a boolean attribute indicate the value of its property is `true`. Its absence indicates that the value of the property is `false`. The value of boolean attributes is ignored, only their presence or absence is relevant.

```html
<n-content-include></n-content-include>
<!-- "defer-load" is false -->
<!-- -->
<n-content-include defer-load></n-content-include>
<!-- "defer-load" is true -->
<!-- -->
<n-content-include defer-load="true"></n-content-include>
<!-- "defer-load" is true -->
<!-- -->
<n-content-include defer-load="foo"></n-content-include>
<!-- "defer-load" is true -->
<!-- -->
<n-content-include defer-load="false"></n-content-include>
<!-- !! "defer-load" is true -->
```

### Code Completion

Shoelace ships with a `custom-elements.json` file that can be used to describe its components to supportive editors, providing code completion (also known as "code hinting" or "IntelliSense"). To enable this, you need to tell your editor where this file is.

### VS Code

1. [Install nent locally](/start/npm)
2. Create a folder called `.vscode` at the root of your project
3. Create a file inside the folder called `settings.json`
4. Add the following to the file

```json
{
  "html.customData": ["./node_modules/@nent/core/dist/custom-elements.json"]
}
```

If `settings.json` already exists in your project, simply add the `html.customData` line to the root of the object.
