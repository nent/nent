# App Action Listener

The App Action Listener is configured to handle commands meant to manage the page as an app. Read more about [actions](/actions).

Topic: `app`

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
