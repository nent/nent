# N-VIDEO-SWITCH

The `<n-video-switch>` element displays a checkbox to control the autoplay setting used for video playback - as well as automatic navigation to the next page when a video ends.

Default: enabled

<!-- Auto Generated Below -->


## Usage

### Basic

Add the `<n-video-switch>` element to any page to allow the user to adjust the autoplay setting. You can style it using standard CSS and if necessary, add CSS styles directly to the input element using the **classes** attribute.

```html
<n-video-switch ...>
</n-video-switch>
```


### With-vime

```html
<n-content-reference module
  script-src="https://cdn.jsdelivr.net/npm/@vime/core@^5/dist/vime/vime.esm.js"
  style-src="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css">
</n-content-reference>
<n-presentation next-after
  analytics-event="pres-video">
  <n-video target-element="vm-player"
    time-event="vmCurrentTimeChange"
    end-event="vmPlaybackEnded"
    ready-event="vmPlaybackReady"
    time-property="currentTime"
    duration-property="duration">

    <vm-player no-controls>
      <vm-video>
        <source cross-origin="anonymous"
          data-src="https://cdn.videvo.net/videvo_files/video/premium/video0290/small_watermarked/_LightShow86_preview.webm"
          type="video/webm" />
      </vm-video>
      <vm-default-ui></vm-default-ui>
    </vm-player>
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

| Property       | Attribute       | Description                                            | Type                  | Default     |
| -------------- | --------------- | ------------------------------------------------------ | --------------------- | ----------- |
| `dataProvider` | `data-provider` | The data provider to store the audio-enabled state in. | `string`              | `'storage'` |
| `inputClass`   | `input-class`   | Any classes to add to the input-element directly.      | `string`, `undefined` | `undefined` |
| `inputId`      | `input-id`      | The id field to add to the input-element directly.     | `string`, `undefined` | `undefined` |


----------------------------------------------

NENT v0.10.6 - Copyright 2022 [all rights reserved]
