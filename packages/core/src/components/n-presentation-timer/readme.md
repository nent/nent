# N-PRESENTATION-TIMER



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute    | Description                                                                                                                                           | Type      | Default     |
| -------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `debug`              | `debug`      | To debug timed elements, set this value to true.                                                                                                      | `boolean` | `false`     |
| `deferLoad`          | `defer-load` | If set, disables auto-starting the timer on render. This will be removed if in a view, when the view is activated or when the start method is called. | `boolean` | `false`     |
| `display`            | `display`    | Display elapsed seconds                                                                                                                               | `boolean` | `false`     |
| `duration`           | `duration`   | Duration before the timer stops and raises the ended event. 0 = never                                                                                 | `number`  | `0`         |
| `interval`           | `interval`   | Interval in milliseconds to request between the getAnimationFrame. This affects the precision.                                                        | `number`  | `200`       |
| `timer` _(required)_ | --           | Normalized timer.                                                                                                                                     | `ITimer`  | `undefined` |


## Events

| Event   | Description                                                   | Type               |
| ------- | ------------------------------------------------------------- | ------------------ |
| `ready` | Ready event letting the presentation layer know it can begin. | `CustomEvent<any>` |


## Methods

### `begin() => Promise<void>`

Begin the timer. This is called automatically
by the presentation element.

#### Returns

Type: `Promise<void>`



### `stop() => Promise<void>`

Stop the timer.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT 2021 - all rights reserved
