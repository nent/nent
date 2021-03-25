# Submitting Event-Actions

## Using Element Event

Event Name: **actionEvent**

### Custom Event

```typescript
const action = new CustomEvent('x:actions', {
  detail: {
    topic: "<topic",
    command: "<command>",
    data: {
      ...
    }
  }
});

const xui = document.querySelector('x-app');
xui.dispatchEvent(action, {
  bubbles: true,
  composed: true,
});

```

## Using the ActionBus

```typescript

import { ActionBus } from '@nent/core';

ActionBus.emit('<topic>', {
  command: "<command>",
  data: {
    ...command args...
  }
})

```
