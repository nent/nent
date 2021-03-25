# Analytics Actions

The Analytics Action Listener is configured to handle commands raised through the [actions system](/actions)
to send to all analytics components which can execute functions for any analytics system configured.

Topic: `analytics`

```html
<x-action-activator activate="...">
  <x-action topic="analytics" command="<command>" ...> </x-action>
</x-action-activator>
```

## Commands

### `send-event`

Sends the payload to the onEvent handler in x-analytics component.

- **(key:value)[]**\
  All key-values pairs are sent to the handler.

```html
<x-action-activator activate="...">
  <x-action
    topic="analytics"
    command="send-event"
    data-(key)="(value)"
  >
  </x-action>
</x-action-activator>
```

### `send-view-time`

Sends the payload to the onEvent handler in x-analytics component.

- **(key-values)[]**\
  All key-values pairs are sent to the handler.

```html
<x-action-activator activate="...">
  <x-action
    topic="analytics"
    command="send-view-time"
    data-value="(value)"
  >
  </x-action>
</x-action-activator>
```

### `send-page-view`

Sends the payload to the onEvent handler in x-analytics component.

- **(key:value)[]**\
  All key-values pairs are sent to the handler.

```html
<x-action-activator activate="...">
  <x-action
    topic="analytics"
    command="send-page-view"
    data-value="(page)"
  >
  </x-action>
</x-action-activator>
```
