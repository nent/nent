# N-AUDIO-ACTION-SOUND-LOAD

The [`n-audio-action-sound-load`](/components/n-audio-action-sound-load) element represents audio files and play behaviors. They are all sent to the global-audio player to pre-load or play when the route is active. The player manages them according to their settings.

> ℹ️ Note: See the [audio](/audio) systems documentation for more information.

## Usage

```html
<n-view-prompt>
  <n-audio-action-sound-load 
    mode='queue|play|load' 
    track-id='<unique-id>' 
    src='<url>' 
    discard='route|next|none' 
    track>
  </n-audio-action-sound-load>
</n-view-prompt>
```

### Simple

```html
<n-view-prompt>
  <n-audio-action-sound-load 
    track-id='<unique-id>' 
    src='<url>'>
  </n-audio-action-sound-load>
</n-view-prompt>
```

## Timed

For timed audio, the audio is sent upfront for pre-loading. Then at the given time, a separate [`n-audio-action-sound`](/components/n-audio-action-sound) event is dispatched to play it at a given time. This way, the audio is likely to play on time without any buffering.

The following demonstrates how to load a track, and wait 10 seconds until it plays. It's important to remember this time can be paused by the user, so it could be any amount of time if a video is playing.

```html
<n-view-prompt>
  <n-audio-action-sound-load 
    track-id='audio1' 
    src='<url>'>
  </n-audio-action-sound-load>
  <n-action-activator 
    activate='AtTime' 
    time='10'>
    <n-audio-action-sound 
      command='start' 
      track-id='audio1'>
    </n-audio-action-sound>
  </n-action-activator>
</n-view-prompt>
```

### Mode

* **queue**: (default) plays after the previous audio is complete or when it's requested.
* **play**: stop any playing audio and play now, buffering be-damned.
* **wait**: wait for action before playing, any currently playing audio continues.

#### Discard

* **video**: when any video plays (default for sound)
* **state**: state changes
* **event**: wait for a stop event (or any other activation)
* **none**: loop until stopped or updated by new state (default for music)

#### Track

If audio has replay set to true, re-entry to the originating state will re-activate the audio if the previous audio has been deactivated. The default is false.

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property               | Attribute    | Description                                                                                                  | Type                          | Default     |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------- | ----------- |
| `deferLoad`            | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`                     | `false`     |
| `discard`              | `discard`    | The discard strategy the player should use for this file.                                                    | `"next"`, `"none"`, `"route"` | `'route'`   |
| `mode`                 | `mode`       | This is the loading strategy that determines what it should do after the file is retrieved.                  | `"load"`, `"play"`, `"queue"` | `'load'`    |
| `src` _(required)_     | `src`        | The path to the audio-file.                                                                                  | `string`                      | `undefined` |
| `trackId` _(required)_ | `track-id`   | The identifier for this music track                                                                          | `string`                      | `undefined` |


## Methods

### `getAction() => Promise<EventAction<AudioInfo | AudioRequest | any>>`

Get the underlying actionEvent instance.

#### Returns

Type: `Promise<EventAction<any>>`



### `sendAction(data?: Record<string, any> | undefined) => Promise<void>`

Send this action to the the action messaging system.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT 2022 - all rights reserved
