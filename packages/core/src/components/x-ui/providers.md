# UI Provider

> The UI Provider System is a way to make UX actions occur without scripting.

The UI Provider listens for actions sent through actions and performs those commands.

## Built-in Provider

The built-in providers provides basic functionality by handling the following commands:

## Custom UI Provider

You can extend this system by adding your own provider, using a Register UI Provider Action.

The system listens for custom events in the action topic: **UI**

To register a provider, provide a unique name and an instance that implements IDataProvider and that data will become available within the expression system.

**Custom Event to Register a Provider:**

```typescript
new CustomEvent('actionEvent', {
  detail: {
    topic: 'ui'
    command: "register-provider",
    data: {
      name: 'myprovider',
      provider: providerInstance
    }
  }
})
```

**UI Provider UI:**

```typescript
type UIProvider = {
  ... any functions ...
  onChange: EventEmitter
}
```

### UI State

```typescript
class commonState {
  theme: 'light' | 'dark' | string
}
```

### On Changed Event

To notify the system that the underlying ui-data has changed, the UI includes a simple event emitter with the name of the property that changed: theme, muted, or autoplay

### Sample Registrations

### Default UI Provider

```typescript

```

#### Native JS

All that is needed by the data-system is a custom event with an instance of your provider in the details.data.provider property. _Note: be sure the event is composed, so it can reach shadow-dom listeners._

```javascript

const customProvider = new MyProvider(); // IDataProvider
const event = new CustomEvent('actionEvent', {
  detail: {
    topic: 'ui',
    command: 'register-provider'
    data: {
      name: 'myprovder,
      provider: customProvider,
    },
  }
});

document.body.dispatchEvent(event, { bubbles: true, composed: true})

```

#### As Component [StencilJS]

```typescript
import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core'

@Component({
  tag: 'my-ui-provider',
  shadow: false,
})
export class MyInterfaceProvider {
  private customProvider = new MyProvider()

  /**
   * This event is raised when the component loads.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: 'actionEvent',
    bubbles: true,
    composed: true,
  })
  actionEvent: EventEmitter<any>

  @State() keys = []

  componentDidLoad() {
    this.raiseAction.emit({
      topic: 'ui',
      command: 'register-provider',
      data: {
        name: this.name,
        provider: this.customProvider,
      },
    })
  }
}
```

Then just include your component somewhere on the page:

```html
<x-app>
  ...
  <my-UI-provider></my-UI-provider
></x-app>
```
