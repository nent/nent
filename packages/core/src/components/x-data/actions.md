# Data Action Listener

The Data Action Listener listens for action commands to request updates from the
given data-providers.

Topic: `data`

```html
<x-action-activator activate="...">
  <x-action
    topic="data"
    command="<command>"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

## Commands

### `register-provider`

Register a new data-provider. See [Data Providers](/data/providers) for more information.
