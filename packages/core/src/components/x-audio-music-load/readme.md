# X-AUDIO-LOAD-MUSIC

This component declares audio used within this [\<x-app-view-do\>](/components/x-app-view-do) route. The [\<x-audio-music-load\>](/components/x-audio-music-load) represents audio files and play behaviors. They are sent to the audio player to pre-load or play when the route is active. The player manages them according to their settings.

> See the [audio](/audio) systems documentation for more information.

## Usage

```html
<x-app-view-do>
  <x-audio-music-load
    mode='play|load'
    track-id='<unique-id>'
    src='<url>'
    discard='route|video|next|none'
    loop
    track
  ></x-audio-music-load>
</x-app-view-do>
```

### Simple

```html
<x-app-view-do>
  <x-audio-music-load 
    track-id='<unique-id>' 
    src='<url>'>
  </x-audio-music-load>
</x-app-view-do>
```

```html
<x-app-view-do>
  <x-audio-music-load
    mode='queue' 
    id='<unique-id>' 
    src='<url>' 
    discard='none' 
    loop>
  </x-audio-music-load>
</x-app-view-do>
```

#### Mode

- **queue**: (default) plays after the previous audio is complete or when it's requested.
- **play**: stop any playing audio and play now, buffering be-damned.
- **wait**: wait for an action before playing, any currently playing audio continues.

#### Discard

- video: when any video plays (default for sound)
- state: state changes
- event: wait for a stop event (or any other activation)
- none: loop until stopped or updated by new state (default for music)

#### Track

If audio has replay set to true, re-entry to the originating state will re-activate the audio if the previous audio has been deactivated. The default is false.

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property               | Attribute    | Description                                                                                                  | Type                          | Default     |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------- | ----------- |
| `deferLoad`            | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`                     | `false`     |
| `discard`              | `discard`    | The discard strategy the player should use for this file.                                                    | `'next'`, `'none'`, `'route'` | `'route'`   |
| `loop`                 | `loop`       | Set this to true to have the audio file loop.                                                                | `boolean`                     | `false`     |
| `mode`                 | `mode`       | This is loading strategy that determines what is should do after the file is retrieved.                      | `'load'`, `'play'`, `'queue'` | `'queue'`   |
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

nent 2021 - all rights reserved
