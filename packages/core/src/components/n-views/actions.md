# N-VIEWS: Actions

The Navigation Action Listener is configured to handle commands raised through the [actions system](/actions).

## Topic: `navigation`

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


```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="go-next" ></n-action>
</n-action-activator>
```

### `go-back`

This tells the navigation system to go back to the previous route, which could be a parent route.

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="go-back"></n-action>
</n-action-activator>
```

### `back`

This is the same as `history.back()` in JavaScript

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="back"></n-action>
</n-action-activator>
```

### `go-to`

This tells the navigation system to go to a specific route.

Arguments:

* **path** (required)\
  The path to navigate to, programmatically.

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="go-to"
    data-path="(value)"></n-action>
</n-action-activator>
```


### `go-to-parent`

This tells the navigation system to go to the parent route, or start url.

```html
<n-action-activator activate="...">
  <n-action topic="navigation" 
    command="go-to-parent"></n-action>
</n-action-activator>
```