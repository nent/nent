# N-PRESENTATION-ACTION



<!-- Auto Generated Below -->


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



### `sendAction(data?: Record<string, any> | undefined) => Promise<void>`

Send this action to the action messaging system.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT 2021 - all rights reserved
