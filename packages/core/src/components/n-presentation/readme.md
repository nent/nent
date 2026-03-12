# N-PRESENTATION

The presentation component is a time stage for which actions can be activated along a timeline. Presentations require a timer element, like a [`n-video`](/components/n-video). If there isn't a video to use for time, NENT ships with a basic timer [`n-presentation-timer`](/components/n-presentation-timer) to create a timeline. This way you can set a duration and activate animations or sound on your own.


## Timed ELements

In addition to [`actions`](/actions), you can place easy-to-use timed attributes on any element within the stage to synchronize them directly. 

> ℹ️ Note: To enable this feature, you have to install the [`n-elements`](/elements) extension.

See [presentation elements](./elements) for more information.


<!-- Auto Generated Below -->


## Overview

This element encapsulates a timed presentation. This element uses
a child n-presentation-timer or n-video element to create time-events
then it delegates those events to time-based action-activators.

If enabled, the n-attributes for time will also get processed. This
element also has the ability to go to the next route using the active
route's 'goNext' function.

## Usage

### Basic-with-timer

```html
<n-presentation>
  <n-presentation-timer duration="3">
  </n-presentation-timer>
  <n-presentation-action time="2" 
    topic="elements"
    command="add-class" 
    data-selector="#animation"
    data-class=".fadeIn">
  </n-presentation-action>
</n-presentation>
```


### Basic-with-video

```html
<n-presentation>
  <n-video src="my.mov">
  </n-video>
  <n-presentation-action time="2" 
    topic="elements"
    command="add-class" 
    data-selector="#animation"
    data-class=".fadeIn">
  </n-presentation-action>
</n-presentation>
```

> ℹ️ Note: When using a video, the timed data from the video is used as the timing-source. This means scrub, pause and skip are all respected with the timed actions and elements.


### Video-timed-elements

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

> ℹ️ Note: For more information on timed-elements, read about the ([`\<n-elements\>](./elements)) extension.


### With-action-activator

```html
<n-presentation>
  <n-presentation-timer duration="3">
  </n-presentation-timer>
  <n-action-activator activate='at-time' 
    time='2'>
    <n-action 
      topic="elements"
      command="add-class" 
      data-selector="#animation"
      data-class=".fadeIn">
    </n-action>
  </n-action-activator>
</n-presentation>
```


### With-action-activator-at-time

```html
<n-presentation>
  <n-video ...>
  </n-video>
  <n-action-activator activate='at-time-end'>
    <n-action 
      topic="elements"
      command="add-class" 
      data-selector="#animation"
      data-class=".fadeIn">
    </n-action>
  </n-action-activator>
</n-presentation>
```
> ℹ️ Note: The `at-time=end` activation-strategy fires when the duration is up or the video ends..



## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                         | Type                  | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `analyticsEvent` | `analytics-event` | Send analytics view-time percentages for this presentation using the event name                                                                                                                                     | `string`, `undefined` | `undefined` |
| `debug`          | `debug`           | To debug timed elements, set this value to true.                                                                                                                                                                    | `boolean`             | `false`     |
| `nextAfter`      | `next-after`      | Go to the next view after the timer ends                                                                                                                                                                            | `boolean`, `string`   | `false`     |
| `timerElement`   | `timer-element`   | The element selector for the timer-element to bind for interval events. If left blank, it looks first an n-timer, then for the first n-video.  If none are found, it creates one manually and starts it immediately | `null`, `string`      | `null`      |


----------------------------------------------

NENT v0.10.8 - Copyright 2022 [all rights reserved]
