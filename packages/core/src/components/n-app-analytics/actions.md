# Analytics Actions

The Analytics Action Listener is configured to handle commands raised through the [actions system](/actions)
to send to all analytics components which can execute functions for any analytics system configured.

Topic: `analytics`

```html
<n-action-activator activate="...">
  <n-action topic="analytics" command="<command>" ...> </n-action>
</n-action-activator>
```

## Commands

### `send-event`

Sends the payload to the onEvent handler in n-app-analytics component.

- **(key:value)[]**\
  All key-values pairs are sent to the handler.

```html
<n-action-activator activate="...">
  <n-action
    topic="analytics"
    command="send-event"
    data-(key)="(value)"
  >
  </n-action>
</n-action-activator>
```

### `send-view-time`

Sends the payload to the onEvent handler in n-app-analytics component.

- **(key-values)[]**\
  All key-values pairs are sent to the handler.

```html
<n-action-activator activate="...">
  <n-action
    topic="analytics"
    command="send-view-time"
    data-value="(value)"
  >
  </n-action>
</n-action-activator>
```

### `send-page-view`

Sends the payload to the onEvent handler in n-app-analytics component.

- **(key:value)[]**\
  All key-values pairs are sent to the handler.

```html
<n-action-activator activate="...">
  <n-action
    topic="analytics"
    command="send-page-view"
    data-value="(page)"
  >
  </n-action>
</n-action-activator>
```
