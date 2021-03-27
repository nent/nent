# X-VIDEO



<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property           | Attribute           | Description                                                                                           | Type                      | Default         |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------- | --------------- |
| `debug`            | `debug`             | To debug timed elements, set this value to true.                                                      | `boolean`                 | `false`         |
| `durationProperty` | `duration-property` | Provide the element property name that holds the duration time in seconds. Default is duration        | `string`                  | `'duration'`    |
| `endEvent`         | `end-event`         | Provider the end event name. Default is ended                                                         | `string`                  | `'ended'`       |
| `targetElement`    | `target-element`    | Provide the element selector for the media object that can provide time-updates and media-end events. | `string`                  | `'video'`       |
| `timeEvent`        | `time-event`        | Provide the time-event name. Default is timeupdate                                                    | `string`                  | `'timeupdate'`  |
| `timeProperty`     | `time-property`     | Provide the element property name that holds the current time in seconds. Default is currentTime      | `string`                  | `'currentTime'` |
| `timer`            | --                  | Normalized video event timer.                                                                         | `VideoTimer \| undefined` | `undefined`     |


----------------------------------------------

nent 2021 - all rights reserved
