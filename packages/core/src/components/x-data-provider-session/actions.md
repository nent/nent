# Session Action Listener

The Session Action Listener can write or delete cookie data.

Topic: `session`

```html
<x-action-activator activate="...">
  <x-action
    topic="session"
    command="<command>"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command sets the experience data

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="session"
    command="set-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

### `remove-data`

This command sets the data in session.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="session"
    command="remove-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```
