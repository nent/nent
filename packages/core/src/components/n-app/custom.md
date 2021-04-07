# N-APP: Custom Providers

The App System allows for registering a custom function-handler, as a way to create custom declarative actions.

To register a provider, you only need to raise a custom-event once with the handler in your event. From then on, any declared actions sent will be handled by the custom provider.


## Register Custom Provider

To add a custom app provider, or a declarative action function-provider, first add the `n-app` element:

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


Then you can send [actions](/actions) declaratively, to execute those functions.

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
