# N-PRESENTATION-TIMER

The `n-presentation-timer` is useful when you want to create a timeline to stage animations and sound or any other HTML-wizardy as part of a non-video presentation. The element takes a duration and begins when you'd expect: on-route enter (if within a route) OR when the parent element renders to the page. It will run, firing all configure timed actions and elements until the duration is reached.

<!-- Auto Generated Below -->


## Overview

This element creates a timer for the presentation
element to use in place of a video, to time actions
or manipulate HTML by time.

## Usage

### Basic

```html
<n-elements></n-elements>
<n-presentation>
  <n-presentation-timer duration="3">
  </n-presentation-timer>
  <div hidden n-show-at="1" n-hide-at="3">
    A temp message!
  </div>
</n-presentation>
```



## Properties

| Property             | Attribute    | Description                                                                                                                                           | Type      | Default     |
| -------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `debug`              | `debug`      | To debug timed elements, set this value to true.                                                                                                      | `boolean` | `false`     |
| `deferLoad`          | `defer-load` | If set, disables auto-starting the timer on render. This will be removed if in a view, when the view is activated or when the start method is called. | `boolean` | `false`     |
| `display`            | `display`    | Display elapsed seconds                                                                                                                               | `boolean` | `false`     |
| `duration`           | `duration`   | Duration before the timer stops and raises the ended event (seconds). 0 = never                                                                       | `number`  | `0`         |
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

NENT v0.10.8 - Copyright 2022 [all rights reserved]
