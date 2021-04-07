# Elements Actions

The Elements Action Listener is configured to handle commands raised through the [actions system](/actions).

## Topic: `elements`

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="<command>" 
    data-(key)="(value)"> </n-action>
</n-action-activator>
```

## Commands

### `element-toggle-class`

Toggles a given class on or off.

Arguments:

* **selector** (required)
* **className** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="element-toggle-class" 
    data-selector="#el" 
    data-class-name="hidden"></n-action>
</n-action-activator>
```

### `element-add-classes`

Add a class or classes to a specified element.

Arguments:

* **selector** (required)
* **classes** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="element-add-class" 
    data-selector="#el" 
    data-classes="hidden red"></n-action>
</n-action-activator>
```

### `element-remove-classes`

Remove a class or classes to a specified element.

Arguments:

* **selector** (required)
* **classes** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="element-remove-class" 
    data-selector="#el" 
    data-classes="hidden red"></n-action>
</n-action-activator>
```

### `element-set-attribute`

Add an attribute to a specified element.

Arguments:

* **selector** (required)
* **attribute** (required)
* **value**

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="element-set-attribute" 
    data-selector="#el" 
    data-attribute="hidden" 
    data-value="true"></n-action>
</n-action-activator>
```

### `element-remove-attribute`

Remove an attribute from the specified element.

Arguments:

* **selector** (required)
* **attribute** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="element-remove-attribute" 
    data-selector="#el" 
    data-attribute="hidden"></n-action>
</n-action-activator>
```

### `element-call-method`

Call a method on an element with optional arguments.

Arguments:

* **selector** (required)
* **method** (required)
* **(key:value)[]**\
  Any additional arguments.

```html
<n-action-activator activate="...">
  <n-action
    topic="elements"
    command="element-call-method"
    data-selector="n-action"
    data-method="sendAction"
    data-(args)=""
  ></n-action>
</n-action-activator>
```
