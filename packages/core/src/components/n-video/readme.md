# N-VIDEO



<!-- Auto Generated Below -->


## Overview

This element enables the UI services. These are typically
web element plug-ins to manage things like Modals, Drawers,
menus, etc. The basic provider is used to toggle dark-mode.

## Usage

### Basic

```html
<n-presentation>
  <n-video target-element="player">
    <video>
      <source cross-origin="anonymous"
        src="https://cdn.videvo.net/videvo_files/video/premium/video0290/small_watermarked/_LightShow86_preview.webm"
        type="video/webm" />
    </video>
  </n-video>
  <div hidden
    n-in-time="0"
    class="fade-in"
    n-out-time="3">
    <h3>First</h3>
    <p>This content appears for the first 3 seconds.</p>
  </div>
  <div hidden
    n-in-time="3"
    class="fade-in"
    n-out-time="6">
    <h3>THEN...</h3>
    <p>This content appears for the until 6 seconds has passed.</p>
  </div>
  <div hidden
    n-in-time="6"
    class="fade-in"
    n-out-time="10">
    <h3>Finally...</h3>
    <p>This content shows until the end.</p>
  </div>
</n-presentation>
```



## Properties

| Property             | Attribute           | Description                                                                                           | Type      | Default         |
| -------------------- | ------------------- | ----------------------------------------------------------------------------------------------------- | --------- | --------------- |
| `debug`              | `debug`             | To debug timed elements, set this value to true.                                                      | `boolean` | `false`         |
| `durationProperty`   | `duration-property` | Provide the element property name that holds the duration time in seconds. Default is duration        | `string`  | `'duration'`    |
| `endEvent`           | `end-event`         | Provider the end event name. Default is ended                                                         | `string`  | `'ended'`       |
| `readyEvent`         | `ready-event`       | Provide the ready event name. Default is ready                                                        | `string`  | `'ready'`       |
| `targetElement`      | `target-element`    | Provide the element selector for the media object that can provide time-updates and media-end events. | `string`  | `'video'`       |
| `timeEvent`          | `time-event`        | Provide the time-event name. Default is timeupdate                                                    | `string`  | `'timeupdate'`  |
| `timeProperty`       | `time-property`     | Provide the element property name that holds the current time in seconds. Default is currentTime      | `string`  | `'currentTime'` |
| `timer` _(required)_ | --                  | Normalized timer.                                                                                     | `ITimer`  | `undefined`     |


## Events

| Event   | Description                                                   | Type               |
| ------- | ------------------------------------------------------------- | ------------------ |
| `ready` | Ready event letting the presentation layer know it can begin. | `CustomEvent<any>` |


----------------------------------------------

NENT v0.10.8 - Copyright 2022 [all rights reserved]
