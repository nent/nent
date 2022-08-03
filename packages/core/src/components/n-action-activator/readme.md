# N-ACTION-ACTIVATOR

This element defines how and when a group of Actions, defined with the [`n-action`](/components/n-action) element, are submitted through the [actions system](/actions).

This element should only ever contain child [`n-action`](/components/n-action) tags. The attributes defines how and when the child-actions are submitted through the [actions system](/actions).

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

## Activation Strategies

The **activate** attribute defines the strategy for activating all child actions in the order they appear.

### `on-element-event`

The default strategy is `on-element-event` which can be used anywhere. The child-actions will fire when the target element raises the target event.

### `on-enter`

Activation occurs when the parent route is activated and the contents are displayed.

### `on-exit`

Activation occurs when the parent route is de-activated and the next route is displayed.

### `on-render`

Activation occurs when the parent element is displayed.

### `at-time`

Activation occurs when the parent route has been activated for the given time within the **time** attribute.

### `at-time-end`

Activation occurs when the presentation ends.

<!-- Auto Generated Below -->


## Usage

### On-element-event

### On Element Event

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


### On-enter

### On Enter

```html
<n-view-prompt ...>
  <n-action-activator activate='on-enter'>
    <n-action ...></n-action>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-view-prompt>
```

> ℹ️ Note: The `on-enter` activation-strategy only works when this element is a child of  [`n-view`](/components/n-view) or [`n-view-prompt`](/components/n-view-prompt).


### On-exit

### On Exit


```html
<n-view-prompt ...>
  <n-action-activator activate='on-exit'>
    <n-action ...></n-action>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-view-prompt>
```

> ℹ️ Note: The `on-exit` activation-strategy only works when this element is a child of  [`n-view`](/components/n-view) or [`n-view-prompt`](/components/n-view-prompt).


### On-render

### On Render

This activation-strategy fires as soon as the activator component renders. It can be pulled in through remote templates or added to a page for analytics.

```html
<n-action-activator activate='on-render'>
  <n-action ...></n-action>
  <n-action ...></n-action>
  <n-action ...></n-action>
</n-action-activator>
```

> ℹ️ Note: The `on-exit` activation-strategy only works when this element is a child of  [`n-view`](/components/n-view) or [`n-view-prompt`](/components/n-view-prompt).


### Presentation-at-time

### At Time

Activation occurs when the presentation has been playing for the given time within the **time** attribute.

> ℹ️ Note: The `at-time` activation-strategy only works when this element is a child of  [`n-presentation`](/components/n-presentation).

```html

<n-presentation>
  <n-presentation-timer duration="3">
  </n-presentation-timer>
  <n-action-activator activate='AtTime' 
    time='3'>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-presentation>
```


### Presentation-at-time-end

#### At Time End
> ℹ️ Note: The `at-time=end` activation-strategy only works when this element is a child of  [`n-presentation`](/components/n-presentation).

```html

<n-presentation>
  <n-video ...>
  </n-video>
  <n-action-activator activate='AtTime' 
    time='3'>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-presentation>

> ℹ️ Note: For more information on presentation and how they work, see  [`n-presentation`](/components/n-presentation)



## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                                                                                                                                                                                   | Type                                                                                         | Default              |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------- |
| `activate`      | `activate`       | The activation strategy to use for the contained actions.                                                                                                                                                                                                                                                                                                                     | `"at-time"`, `"at-time-end"`, `"on-element-event"`, `"on-enter"`, `"on-exit"`, `"on-render"` | `'on-element-event'` |
| `debug`         | `debug`          | Turn on debug statements for load, update and render events.                                                                                                                                                                                                                                                                                                                  | `boolean`                                                                                    | `false`              |
| `once`          | `once`           | Limit the activation to ONCE. This could be helpful if an action has side-effects if it is run multiple times.  Note: the activation state is stored in memory and does not persist across refreshes.                                                                                                                                                                         | `boolean`                                                                                    | `false`              |
| `targetElement` | `target-element` | The element or elements to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelectorAll function to find the element/s based on the query in this attribute.  If left blank, this element looks for child elements matching: 'a,button,input[type=button]'  For use with activate="on-element-event" and "at-time" | `string`, `undefined`                                                                        | `undefined`          |
| `targetEvent`   | `target-event`   | This is the name of the event/s to listen to on the target element separated by comma.                                                                                                                                                                                                                                                                                        | `string`                                                                                     | `'click,keydown'`    |
| `time`          | `time`           | The time, in seconds at which the contained actions should be submitted.  For use with activate="at-time" Only!                                                                                                                                                                                                                                                               | `number`, `undefined`                                                                        | `undefined`          |


## Methods

### `activateActions(once?: boolean) => Promise<void>`

Manually activate all actions within this activator.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT 2022 - all rights reserved
