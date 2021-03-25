# Navigation Actions

The Navigation Action Listener is configured to handle commands raised through the [actions system](/actions).

Topic: `navigation`

```html
<x-action-activator activate="...">
  <x-action topic="navigation" 
    command="<command>" 
    data-(key)="(value)"> </x-action>
</x-action-activator>
```

## Commands

### `go-next`

This tells the navigation system to go to the next [`x-app-view-do`](/components/x-app-view-do) route or back to the parent [`x-app-view`](/components/x-app-view) route.

> This command has no effect outside of a `x-app-view-do` route.

```html
<x-action-activator activate="...">
  <x-action topic="navigation" 
    command="go-next" ></x-action>
</x-action-activator>
```

### `go-to`

This tells the navigation system to go to a specific route.

Arguments:

* **url** (required)\
  The url to navigate to, programmatically.

```html
<x-action-activator activate="...">
  <x-action topic="navigation" 
    command="go-to"
    data-path="(value)"></x-action>
</x-action-activator>
```

### `go-back`

This tells the navigation system to go back to the previous route.

> Same as `history.back()` in JavaScript

```html
<x-action-activator activate="...">
  <x-action topic="navigation" 
    command="go-back"></x-action>
</x-action-activator>
```
