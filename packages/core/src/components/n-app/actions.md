# N-APP: Actions

The App Action Listener is configured to handle commands meant to manage the page as an app. Read more about [actions](/actions).

## Topic: `app`

```html
<n-action-activator activate="...">
  <n-action topic="app" 
    command="<command>" 
    data-(key)="(value)"> </n-action>
</n-action-activator>
```

## Commands

### `set-dark-mode`

Sets the main page theme to dark if the value is true. (Set to null, for system preference)

Arguments:

* **value** (required)\
  Set's the theme to 'dark' if true, 'light' if false, and 'system' if null.

```html
<n-action-activator activate="...">
  <n-action topic="app" 
    command="set-dark-mode" 
    data-value="true|false"> 
  </n-action>
</n-action-activator>
```

### `log`

Writes data to the console using console.log()

> Same as `console.log()` in JavaScript

Arguments:

* **message** (required)\
  Any data that is sent to console.log

```html
<n-action-activator activate="on-render">
  <n-action topic="app" 
    command="log" 
    data-message="Hello world."> 
  </n-action>
</n-action-activator>
```

### `warn`

Writes data to the console using console.log()

> Same as `console.warn()` in JavaScript

Arguments:

* **message** (required)\
  Any data that is sent to console.warn

```html
<n-action-activator activate="on-render">
  <n-action topic="app" 
    command="warn" 
    data-message="Hello world."> 
  </n-action>
</n-action-activator>
```

### `dir`

Writes data to the console using console.dir()

> Same as `console.dir()` in JavaScript

Arguments:

* **<any>** (required)\
  Any data that is sent to console.dir

```html
<n-action-activator activate="on-render">
  <n-action topic="app" 
    command="dir" 
    data-message="Hello world."> 
  </n-action>
</n-action-activator>
```

### `register-provider`

Register a new app-provider. See [custom data](/components/n-app/custom) for more information.