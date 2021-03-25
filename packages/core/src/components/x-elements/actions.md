# Elements Actions

The Elements Action Listener is configured to handle commands raised through the [actions system](/actions).

Topic: `elements`

```html
<x-action-activator activate="...">
  <x-action topic="elements" 
    command="<command>" 
    data-(key)="(value)"> </x-action>
</x-action-activator>
```

## Commands

### `element-toggle-class`

Toggles a given class on or off.

Arguments:

* **selector** (required)
* **className** (required)

```html
<x-action-activator activate="...">
  <x-action topic="elements" 
    command="element-toggle-class" 
    data-selector="#el" 
    data-class-name="hidden"></x-action>
</x-action-activator>
```

### `element-add-classes`

Add a class or classes to a specified element.

Arguments:

* **selector** (required)
* **classes** (required)

```html
<x-action-activator activate="...">
  <x-action topic="elements" 
    command="element-add-class" 
    data-selector="#el" 
    data-classes="hidden red"></x-action>
</x-action-activator>
```

### `element-remove-classes`

Remove a class or classes to a specified element.

Arguments:

* **selector** (required)
* **classes** (required)

```html
<x-action-activator activate="...">
  <x-action topic="elements" 
    command="element-remove-class" 
    data-selector="#el" 
    data-classes="hidden red"></x-action>
</x-action-activator>
```

### `element-set-attribute`

Add an attribute to a specified element.

Arguments:

* **selector** (required)
* **attribute** (required)
* **value**

```html
<x-action-activator activate="...">
  <x-action topic="elements" 
    command="element-set-attribute" 
    data-selector="#el" 
    data-attribute="hidden" 
    data-value="true"></x-action>
</x-action-activator>
```

### `element-remove-attribute`

Remove an attribute from the specified element.

Arguments:

* **selector** (required)
* **attribute** (required)

```html
<x-action-activator activate="...">
  <x-action topic="elements" 
    command="element-remove-attribute" 
    data-selector="#el" 
    data-attribute="hidden"></x-action>
</x-action-activator>
```

### `element-call-method`

Call a method on an element with optional arguments.

Arguments:

* **selector** (required)
* **method** (required)
* **(key:value)[]**\
  Any additional arguments.

```html
<x-action-activator activate="...">
  <x-action
    topic="elements"
    command="element-call-method"
    data-selector="x-action"
    data-method="sendAction"
    data-(args)=""
  ></x-action>
</x-action-activator>
```
