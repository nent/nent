# N-AUDIO-ACTION-MUSIC-LOAD

This component declares audio playback. The [\<n-audio-action-music-load\>](/components/n-audio-action-music-load) element represents audio files and play behaviors. They are sent to the audio player to pre-load or play when the route is active. The player manages them according to their settings.

> See the [audio](/audio) systems documentation for more information.

## Usage

```html
<n-view-prompt>
  <n-audio-action-music-load
    mode='play|load'
    track-id='<unique-id>'
    src='<url>'
    discard='route|video|next|none'
    loop
    track
  ></n-audio-action-music-load>
</n-view-prompt>
```

### Simple

```html
<n-view-prompt>
  <n-audio-action-music-load 
    track-id='<unique-id>' 
    src='<url>'>
  </n-audio-action-music-load>
</n-view-prompt>
```

```html
<n-view-prompt>
  <n-audio-action-music-load
    mode='queue' 
    id='<unique-id>' 
    src='<url>' 
    discard='none' 
    loop>
  </n-audio-action-music-load>
</n-view-prompt>
```

#### Mode

- **queue**: (default) plays after the previous audio is complete or when it's requested.
- **play**: stop any playing audio and play now, buffering be-damned.
- **wait**: wait for action before playing, any currently playing audio continues.

#### Discard

- **video**: when any video plays (default for sound)
- **state**: state changes
- **event**: wait for a stop event (or any other activation)
- **none**: loop until stopped or updated by new state (default for music)

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
| `loop`                 | `loop`       | Set this to true to have the audio file loop.                                                                | `boolean`                     | `false`     |
| `mode`                 | `mode`       | This is the loading strategy that determines what it should do after the file is retrieved.                  | `"load"`, `"play"`, `"queue"` | `'queue'`   |
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

NENT 2021 - all rights reserved
