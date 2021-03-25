# X-ACTION-ACTIVATOR

This element defines how and when a group of Actions, defined with the [\<x-action\>](/components/x-action) element, are submitted through the [actions system](/actions).

## Activation Strategies

The **activate** attribute define the strategy for activating all child actions, in the order they appear.

### `on-element-event`

The default strategy is `on-element-event` can be used anywhere. The child actions will fire when the target element raises the target event.

```html
<x-action-activator
  activate='OnElementEvent'
  target-element='#submit'
  target-event='click'
  >
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
</x-action-activator>
<button id='submit'>Enter</button>
```

### `on-element-event`: Default Element and Event

The default activation is OnElementEvent and the default event is click. Also, if no target-element is supplied, it looks for the first element that isn't an action or script and attaches to its event. If no target-event is defined, it assumes 'click'

```html
<x-action-activator>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <button>Click Me</button>
</x-action-activator>
```

> _PRO-TIP:_ This element appends any child input element's values to the actions it fires.

### `on-enter`

Activation occurs when the parent route is activated and the contents are displayed.

> The `on-exit` activation-strategy only works when this element is a child of  [\<x-app-view\>](/components/x-app-view) or [\<x-app-view-do\>](/components/x-app-view-do).

```html
<x-app-view-do ...>
  <x-action-activator activate='OnEnter'>
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-app-view-do>
```

### `on-exit`

Activation occurs when the parent route is de-activated and the next route is displayed.

> The `on-exit` activation-strategy only works when this element is a child of  [\<x-app-view\>](/components/x-app-view) or [\<x-app-view-do\>](/components/x-app-view-do).

```html
<x-app-view-do ...>
  <x-action-activator activate='OnExit'>
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-app-view-do>
```

### `at-time`

Activation occurs when the parent route has been activated for the given time within the **time** attribute.

> The `on-exit` activation-strategy only works when this element is a child of  [\<x-app-view-do\>](/components/x-app-view-do).

```html
<x-app-view-do ...>
  <x-action-activator activate='AtTime' 
    time='3'>
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-app-view-do>
```



<!-- Auto Generated Below -->


## Usage

### Basic

## Basic Usage

This element should only ever contain child [\<x-action\>](/components/x-action) tags. The attributes tells the parent The parent tag defines how and when the child actions are submitted through the [actions system](/actions).

```html
<x-action-activator
  activate='<activation-strategy>'
  ...
  supporting
  attributes
  ...
>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
</x-action-activator>
```



## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                       | Type                                                         | Default              |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------- |
| `activate`      | `activate`       | The activation strategy to use for the contained actions.                                                                                                                                                         | `'at-time'`, `'on-element-event'`, `'on-enter'`, `'on-exit'` | `'on-element-event'` |
| `debug`         | `debug`          | Turn on debug statements for load, update and render events.                                                                                                                                                      | `boolean`                                                    | `false`              |
| `once`          | `once`           | Limit the activation to ONCE. This could be helpful if an action has side-effects if it is run multiple times.  Note: the activation state is stored in memory and does not persist across refreshes.             | `boolean`                                                    | `false`              |
| `targetElement` | `target-element` | The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate='on-element-event' Only! | `string`, `undefined`                                        | `undefined`          |
| `targetEvent`   | `target-event`   | This is the name of the event/s to listen to on the target element separated by comma.                                                                                                                            | `string`                                                     | `'click,keydown'`    |
| `time`          | `time`           | The time, in seconds at which the contained actions should be submitted.  For use with activate='at-time' Only!                                                                                                   | `number`, `undefined`                                        | `undefined`          |


## Methods

### `activateActions() => Promise<void>`

Manually activate all actions within this activator.

#### Returns

Type: `Promise<void>`




----------------------------------------------

nent 2021 - all rights reserved
