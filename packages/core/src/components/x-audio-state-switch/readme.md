# X-AUDIO-STATE-SWITCH

The [\<x-audio-state-switch\>](/components/x-audio-state-switch) component exposes a checkbox to enable or disable global audio, for background sounds and video components.

## Usage

Display a checkbox for users to set a preference for sound. Disabled mutes all videos and disables all presentational audio.

Using the [\<x-audio-state-switch\>](/components/x-audio-state-switch) component description.

```html
<x-audio-state-switch></x-audio-state-switch>
```

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property       | Attribute       | Description                                        | Type                   | Default     |
| -------------- | --------------- | -------------------------------------------------- | ---------------------- | ----------- |
| `classes`      | `classes`       | Any classes to add to the input-element directly.  | `string`, `undefined`  | `undefined` |
| `dataProvider` | `data-provider` | The data provider to store the audio state in.     | `string`               | `'storage'` |
| `inputId`      | `input-id`      | The id field to add to the input-element directly. | `string`, `undefined`  | `undefined` |
| `setting`      | `setting`       | Which state property this switch controls.         | `'enabled'`, `'muted'` | `'enabled'` |


----------------------------------------------

nent 2021 - all rights reserved
