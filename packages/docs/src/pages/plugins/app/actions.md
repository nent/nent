# App Actions

The default ui Action Listener is configured to handle commands meant to alter HTML elements
raised through the [Actions](/actions).

Topic: `ui`

```html
<n-action-activator activate="...">
  <n-action topic="app" 
    command="<command>" 
    data-(key)="(value)"> </n-action>
</n-action-activator>
```

## Commands

### `set-theme`

Sets the main page theme to dark or light.

Arguments:

* **theme** (required)\
  Set's the theme to 'dark' or 'light'.

```html
<n-action-activator activate="...">
  <n-action topic="app" 
    command="set-theme" 
    data-theme="dark"> </n-action>
</n-action-activator>
```

### `console`

Writes data to the console using console.log()

> Same as `console.log()` in JavaScript

Arguments:

* **data** (required)\
  Any data that is sent to console.log

```html
<n-action-activator activate="...">
  <n-action topic="app" 
    command="set-theme" 
    data-theme="dark"> </n-action>
</n-action-activator>
```
