# Custom Provider

Data Providers are the underlying data-store for expressions. You can extend your HTML with data from a custom provider by registering it.

> The Data Provider system is a way to normalize data access for use within Data Expressions.

## Register Custom Provider

To add a custom data provider, or a declarative action function-provider, first add the `n-data` element:

```html
<n-data>  
</n-data>
```


Then register your provider, by raising a custom event `nent:actions` with an instance of your provider in the following format.


```javascript

const customProvider = {
  doSomething: (...args) => { }
}
const event = new CustomEvent('nent:actions', {
  detail: {
    topic: 'data',
    command: 'register-provider'
    data: {
      name: 'custom',
      provider: customProvider,
    },
  }
});

document.body.dispatchEvent(event, { bubbles: true, composed: true})

```

Provide a unique name and an instance that implements IDataProvider and that data will become available within the expression system, once registered.

For example, assuming your instance has a data item with key **name**, your HTML can use this value in the expression: 

    {{custom:name}}

#### Data Provider Interface

```javascript
export interface IDataProvider {
  get(key: string): Promise<string>
  set(key: string, value: string): Promise<void>
  changed: EventEmitter
}
```

### Data Changed Event

To notify the system that your underlying data has changed, the interface includes a simple event emitter. Emit `data-changed` from an emitter and all elements using your value will re-render with the new data value.

```javascript
export interface IDataProvider {
  ...
  set(key: string, value: string): Promise<void> {
    // my set 
    this.changed.emit('data-changed')
  }
  changed: EventEmitter
}
```

### Sample Data Provider

```javascript
import { EventEmitter } from '@nent/core'

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
    this.changed.emit('data-changed')
  }

  changed: EventEmitter
}
```

### Sample Registrations

#### Native

All that is needed by the data system is a custom event with an instance of your provider in the `detail.data.provider` property. 

_Note: be sure the event is composed, so it can reach shadow-dom listeners._

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

#### Stencil Component

```javascript
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
    eventName: 'nent:actions',
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
<n-data>
  ...
  <my-data-provider></my-data-provider>
</n-data>
```
