# N-ACTION-ACTIVATOR

This element defines how and when a group of Actions, defined with the [\<n-action\>](/components/n-action) element, are submitted through the [actions system](/actions).

## Activation Strategies

The **activate** attribute defines the strategy for activating all child actions in the order they appear.

### `on-element-event`

The default strategy is `on-element-event` which can be used anywhere. The child-actions will fire when the target element raises the target event.

```html
<n-action-activator
  activate='OnElementEvent'
  target-element='#submit'
  target-event='click'
  >
  <n-action ...></n-action>
  <n-action ...></n-action>
  <n-action ...></n-action>
</n-action-activator>
<button id='submit'>Enter</button>
```

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

> _PRO-TIP:_ This element appends any child input element's values to the actions it fires.

### `on-enter`

Activation occurs when the parent route is activated and the contents are displayed.

> The `on-exit` activation-strategy only works when this element is a child of  [\<n-view\>](/components/n-view) or [\<n-view-prompt\>](/components/n-view-prompt).

```html
<n-view-prompt ...>
  <n-action-activator activate='OnEnter'>
    <n-action ...></n-action>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-view-prompt>
```

### `on-exit`

Activation occurs when the parent route is de-activated and the next route is displayed.

> The `on-exit` activation-strategy only works when this element is a child of  [\<n-view\>](/components/n-view) or [\<n-view-prompt\>](/components/n-view-prompt).

```html
<n-view-prompt ...>
  <n-action-activator activate='OnExit'>
    <n-action ...></n-action>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-view-prompt>
```

### `at-time`

Activation occurs when the parent route has been activated for the given time within the **time** attribute.

> The `on-exit` activation-strategy only works when this element is a child of  [\<n-view-prompt\>](/components/n-view-prompt).

```html
<n-view-prompt ...>
  <n-action-activator activate='AtTime' 
    time='3'>
    <n-action ...></n-action>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-view-prompt>
```


<!-- Auto Generated Below -->


## Usage

### Basic

This element should only ever contain child [\<n-action\>](/components/n-action) tags. The attributes defines how and when the child-actions are submitted through the [actions system](/actions).

```html
<n-action-activator
  activate='<activation-strategy>'
  ...
  supporting
  attributes
  ...
>
  <n-action ...></n-action>
  <n-action ...></n-action>
  <n-action ...></n-action>
</n-action-activator>
```



## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                       | Type                                                                        | Default              |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------- |
| `activate`      | `activate`       | The activation strategy to use for the contained actions.                                                                                                                                                         | `"at-time"`, `"on-element-event"`, `"on-enter"`, `"on-exit"`, `"on-render"` | `'on-element-event'` |
| `debug`         | `debug`          | Turn on debug statements for load, update and render events.                                                                                                                                                      | `boolean`                                                                   | `false`              |
| `once`          | `once`           | Limit the activation to ONCE. This could be helpful if an action has side-effects if it is run multiple times.  Note: the activation state is stored in memory and does not persist across refreshes.             | `boolean`                                                                   | `false`              |
| `targetElement` | `target-element` | The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate="on-element-event" Only! | `string \| undefined`                                                       | `undefined`          |
| `targetEvent`   | `target-event`   | This is the name of the event/s to listen to on the target element separated by comma.                                                                                                                            | `string`                                                                    | `'click,keydown'`    |
| `time`          | `time`           | The time, in seconds at which the contained actions should be submitted.  For use with activate="at-time" Only!                                                                                                   | `number \| undefined`                                                       | `undefined`          |


## Methods

### `activateActions() => Promise<void>`

Manually activate all actions within this activator.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT 2021 - all rights reserved
