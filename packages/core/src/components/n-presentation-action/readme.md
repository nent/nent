# N-PRESENTATION-ACTION

For use in the `n-presentation` element only. Action activation occurs when the `n-presentation` element reaches a certain time.

> ℹ️ Note: This element combines the `n-action-activator` and `n-action` for convenience. It uses the activation strategy `at-time`.

<!-- Auto Generated Below -->


## Overview

This specialized action contains the time attribute,
allowing it to be activated directly within the n-presentation
element (no n-action-activator needed)

## Usage

### Basic

```html
<n-presentation>
  <n-video ...>
  </n-video>
  <n-presentation-action time="2" 
    topic="elements"
    command="add-class" 
    data-selector="#animation"
    data-class=".fadeIn">
  </n-n-presentation-action>
</n-presentation>
```



## Properties

| Property               | Attribute | Description                                          | Type                           | Default     |
| ---------------------- | --------- | ---------------------------------------------------- | ------------------------------ | ----------- |
| `command` _(required)_ | `command` | The command to execute.                              | `string`                       | `undefined` |
| `time`                 | `time`    | The time this should execute                         | `"end"`, `number`, `undefined` | `undefined` |
| `topic` _(required)_   | `topic`   | This is the topic this action-command is targeting.  | `string`                       | `undefined` |
| `when`                 | `when`    | A predicate to evaluate prior to sending the action. | `string`, `undefined`          | `undefined` |


## Methods

### `getAction() => Promise<EventAction<any> | null>`

Get the underlying actionEvent instance. Used by the n-action-activator element.

#### Returns

Type: `Promise<EventAction<any> | null>`



### `sendAction(data?: Record<string, any>) => Promise<void>`

Send this action to the action messaging system.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT v0.10.8 - Copyright 2022 [all rights reserved]
