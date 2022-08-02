### `on-element-event`: Default Element and Event

The default activation is OnElementEvent and the default event is click. Also, if no target-element is supplied, it looks for the first element that isn't an action or script and attaches to its event. If no target-event is defined, it assumes 'click'

```html
<n-action-activator>
  <n-action ...></n-action>
  <n-action ...></n-action>
  <n-action ...></n-action>
  <button>Click Me</button>
</n-action-activator>
```

> ℹ️ Note: _PRO-TIP:_ This element appends any child input element's values to the actions it fires.