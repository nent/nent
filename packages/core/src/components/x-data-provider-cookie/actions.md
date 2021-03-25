# Cookie Action Listener

The Cookie Action Listener can write or delete cookie data.

Topic: `cookie`

```html
<x-action-activator activate="...">
  <x-action
    topic="cookie"
    command="<command>"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command encodes and sets data into the browser cookie for this user/browser combination.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="cookie"
    command="set-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

### `remove-data`

This command removes data from the cookie
Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="cookie"
    command="remove-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```
