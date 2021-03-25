# Storage Action Listener

The Storage Action Listener can write or delete cookie data.

Topic: `storage`

```html
<x-action-activator activate="...">
  <x-action
    topic="storage"
    command="<command>"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command sets the data in storage.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="storage"
    command="set-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

### `remove-data`

This command sets the data in storage.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="storage"
    command="remove-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```
