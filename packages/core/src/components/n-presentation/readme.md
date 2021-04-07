# n-presentation



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                        | Type                  | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `analytics`    | `analytics`     | Send analytics view-time percentages for this presentation using the event name                                                                                                                                    | `string`, `undefined` | `undefined` |
| `debug`        | `debug`         | To debug timed elements, set this value to true.                                                                                                                                                                   | `boolean`             | `false`     |
| `nextAfter`    | `next-after`    | Go to the next view after a given time if a number is present, otherwise when the end-event occurs.                                                                                                                | `boolean`, `number`   | `false`     |
| `timer`        | --              | The timer instance for a manual timer.                                                                                                                                                                             | `ITimer`, `null`      | `null`      |
| `timerElement` | `timer-element` | The element selector for the timer-element to bind for interval events. If left blank, it looks first an n-timer, then for the first n-video.  If none are found, it creates on manually and starts it immediately | `string`, `undefined` | `undefined` |


----------------------------------------------

NENT 2021 - all rights reserved
