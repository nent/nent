# Custom Provider

Data Providers are the underlying data-store for expressions. You can extend your HTML with data from your own provider by registering a custom provider.

> The Data Provider system is a way to normalize data access for use within Data Expressions.

To register a provider, provide a unique name and an instance that implements IDataProvider and that data will become available within the expression system, once registered.


**Register Provider:**

```typescript
new CustomEvent('nent:actions', {
  detail: {
    topic: 'data'
    command: "register-provider",
    data: {
      name: 'my_provider',
      provider: providerInstance
    }
  }
})
```

Assuming your instance has a data item with key **name**, your HTML can use this value in the expression: `{{my_provider:name}}`

**Data Provider Interface:**

```typescript
export interface IDataProvider {
  get(key: string): Promise<string>
  set(key: string, value: string): Promise<void>
  changed: EventEmitter
}
```

### Data Changed Event

To notify the system that your underlying data has changed, the interface includes a simple event emitter. Emit 'data-changed' from an emitter and all elements using your value will re-render with the new data value.

### Sample Data Provider

```typescript
import { DATA_EVENTS, IDataProvider, EventEmitter } from '@nent/core'

export class MyProvider implements IDataProvider {
  data = {}
  constructor() {
    this.changed = new EventEmitter()
  }

  async get(key: string): Promise<string | null> {
    return this.data[key] || null
  }
  async set(key: string, value: string): Promise<void> {
    this.data[key] = value.slice()
    this.changed.emit(DATA_EVENTS.DataChanged)
  }

  changed: EventEmitter
}
```

### Sample Registrations

#### Native JS

All that is needed by the data-system is a custom event with an instance of your provider in the details.data.provider property. _Note: be sure the event is composed, so it can reach shadow-dom listeners._

```javascript
const customProvider = new MyProvider(); // IDataProvider
const event = new CustomEvent('nent:actions', {
  detail: {
    topic: 'data',
    command: 'register-provider'
    data: {
      name: 'my_provider,
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
  tag: 'my-data-provider',
  shadow: false,
})
export class MyDataProvider {
  private customProvider = new MyProvider()

  /**
   * This event is raised when the element loads.
   * The data-provider system should capture this event
   * and register the provider for use in expressions.
   */
  @Event({
    eventName: 'nent:events',
    bubbles: true,
    composed: true,
  })
  raiseAction: EventEmitter<any>

  @State() keys = []

  componentDidLoad() {
    this.raiseAction.emit({
      command: 'register-provider',
      data: {
        name: this.name,
        provider: this.customProvider,
      },
    })
  }
}
```

Then just include your element somewhere on the page:

```html
<n-views>
  ...
  <my-data-provider></my-data-provider
></n-views>
```
