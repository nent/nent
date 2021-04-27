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

### `toggle-class`

Toggles a given class on or off.

Arguments:

* **selector** (required)
* **className** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="toggle-class" 
    data-selector="#el" 
    data-class-name="hidden"></n-action>
</n-action-activator>
```

### `add-classes`

Add a class or classes to a specified element.

Arguments:

* **selector** (required)
* **classes** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="add-class" 
    data-selector="#el" 
    data-classes="hidden red"></n-action>
</n-action-activator>
```

### `remove-classes`

Remove a class or classes to a specified element.

Arguments:

* **selector** (required)
* **classes** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="remove-class" 
    data-selector="#el" 
    data-classes="hidden red"></n-action>
</n-action-activator>
```

### `set-attribute`

Add an attribute to a specified element.

Arguments:

* **selector** (required)
* **attribute** (required)
* **value**

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="set-attribute" 
    data-selector="#el" 
    data-attribute="hidden" 
    data-value="true"></n-action>
</n-action-activator>
```

### `remove-attribute`

Remove an attribute from the specified element.

Arguments:

* **selector** (required)
* **attribute** (required)

```html
<n-action-activator activate="...">
  <n-action topic="elements" 
    command="remove-attribute" 
    data-selector="#el" 
    data-attribute="hidden"></n-action>
</n-action-activator>
```

### `call-method`

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
    command="call-method"
    data-selector="n-action"
    data-method="sendAction"
    data-(args)=""
  ></n-action>
</n-action-activator>
```
