# Navigation Actions

The Navigation Action Listener is configured to handle commands raised through the [actions system](/actions).

Topic: `navigation`

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="<command>" 
    data-(key)="(value)"> </n-action>
</n-action-activator>
```

## Commands

### `go-next`

This tells the navigation system to go to the next [`n-view-prompt`](/components/n-view-prompt) route or back to the parent [`n-view`](/components/n-view) route.

> This command has no effect outside of a `n-view-prompt` route.

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="go-next" ></n-action>
</n-action-activator>
```

### `go-to`

This tells the navigation system to go to a specific route.

Arguments:

* **url** (required)\
  The url to navigate to, programmatically.

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="go-to"
    data-path="(value)"></n-action>
</n-action-activator>
```

### `go-back`

This tells the navigation system to go back to the previous route.

> Same as `history.back()` in JavaScript

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="go-back"></n-action>
</n-action-activator>
```
