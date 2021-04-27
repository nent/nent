# n-presentation



#### Presentation Features

- Supports [video](/video) support:
  * Video Timer becomes the basis for Timed Actions
  * Auto-Play w/Global Setting
  * Auto-Next available on Video End
  * Video Supports Global Audio Preferences
- Supports [audio](/audio) support:
  * Time & Event-based Sounds \* Voice Over
  * Background Music
  * Voice-overs
- Supports [actions](/actions):
  * At route entrance
  * At a given time
  * At a given user interaction
  * Before route exit
- Built-in timer & and optional duration:
  * Synced to video (respecting scrub, pause, etc)
  * Based on time elapsed since the entrance
  * Hide and show elements at certain times
  * Time-based animation class toggling
  * Time-based navigation or when the video ends.
- Automatic visibility resolution for child elements using special attributes.
- Automatic next and back handlers for child elements using special attributes.
- Automatic time/percentage value insertion for child elements using special attributes.




<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                        | Type                  | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `analyticsEvent` | `analytics-event` | Send analytics view-time percentages for this presentation using the event name                                                                                                                                    | `string`, `undefined` | `undefined` |
| `debug`          | `debug`           | To debug timed elements, set this value to true.                                                                                                                                                                   | `boolean`             | `false`     |
| `nextAfter`      | `next-after`      | Go to the next view after a given time if a number is present, otherwise when the end-event occurs.                                                                                                                | `boolean`             | `false`     |
| `timerElement`   | `timer-element`   | The element selector for the timer-element to bind for interval events. If left blank, it looks first an n-timer, then for the first n-video.  If none are found, it creates on manually and starts it immediately | `null`, `string`      | `null`      |


----------------------------------------------

NENT 2021 - all rights reserved
