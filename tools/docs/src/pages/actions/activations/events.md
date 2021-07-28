# Submitting Event-Actions

## Using Element Event

Event Name: **actionEvent**

### Custom Event

```typescript
const action = new CustomEvent('nent:actions', {
  detail: {
    topic: "<topic",
    command: "<command>",
    data: {
      ...
    }
  }
});

document.dispatchEvent(action, {
  bubbles: true,
  composed: true,
});

```

## Using the Action Bus

```typescript

import { ActionBus } from '@nent/core';

ActionBus.emit('<topic>', {
  command: "<command>",
  data: {
    ...command args...
  }
})

```
