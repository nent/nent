# N-AUDIO-ACTION-SOUND

This element represents an action to be fired. This specialized action encapsulates the required parameters needed for audio-based actions, for sound.

> ℹ️ Note: See the [audio](/audio) systems documentation for more information.

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property               | Attribute  | Description                                          | Type                                                             | Default     |
| ---------------------- | ---------- | ---------------------------------------------------- | ---------------------------------------------------------------- | ----------- |
| `command` _(required)_ | `command`  | The command to execute.                              | `"mute"`, `"pause"`, `"resume"`, `"seek"`, `"start"`, `"volume"` | `undefined` |
| `topic`                | `topic`    | Readonly topic                                       | `"audio"`                                                        | `'audio'`   |
| `trackId`              | `track-id` | The track to target.                                 | `string`, `undefined`                                            | `undefined` |
| `value`                | `value`    | The value payload for the command.                   | `boolean`, `number`, `string`, `undefined`                       | `undefined` |
| `when`                 | `when`     | A predicate to evaluate prior to sending the action. | `string`, `undefined`                                            | `undefined` |


## Methods

### `getAction() => Promise<EventAction<any> | null>`

Get the underlying actionEvent instance. Used by the n-action-activator element.

#### Returns

Type: `Promise<EventAction<any> | null>`



### `sendAction(data?: Record<string, any> | undefined) => Promise<void>`

Send this action to the the action messaging system.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT v0.10.6 - Copyright 2022 [all rights reserved]
