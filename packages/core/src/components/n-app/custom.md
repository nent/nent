# App Provider

> The UI Provider System is a way to make UX actions occur without scripting.

The UI Provider listens for actions sent through actions and performs those commands.

## Built-in Provider

The built-in provider has basic functionality by handling the following commands:

## Custom Provider

You can extend this system by adding your own provider.

The system listens for custom events in the action topic: **UI**

To register a provider, provide a unique name and an instance that implements IDataProvider and that data will become available within the expression system.

**Custom Event to Register a Provider:**

```typescript
new CustomEvent('actionEvent', {
  detail: {
    topic: 'app'
    command: "register-provider",
    data: {
      name: 'myprovider',
      provider: providerInstance
    }
  }
})
```


### Sample Registrations


#### Custom App Provider

To add a custom-app provider, or a declarative action function-provider, first add the `n-app` element:

```html
<n-app>  
</n-app>
```

Then register your provider, by raising a custom event `nent:actions` with an instance of your provider in the following format.
 
```javascript

const customProvider = {
  doSomething: (...args) => { }
}
const event = new CustomEvent('nent:actions', {
  detail: {
    topic: 'app',
    command: 'register-provider'
    data: {
      name: 'custom',
      provider: customProvider,
    },
  }
});

document.body.dispatchEvent(event, { bubbles: true, composed: true})

```

> Note: be sure the event is composed, so it can reach shadow-dom listeners.


Then you can declare [n-actions](/actions) to declaratively execute those functions.

```html
<n-app>
  ...
  <n-action-activator>
    <n-action 
      topic="app" 
      data-name="custom" 
      data-command="doSomething" 
      data-arg1="1">
    </n-action>
  </n-action-activator>
></n-app>
```
