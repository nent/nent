# N-AUDIO: Data Provider

This provider allows templates to include data around the audio player.

Provider Key: **audio**

## Installation

The audio provider is registered using the audio component **[\<n-audio\>](/components/n-audio)**. Add the `data-provider attribute to turn it on.

```html
<n-audio data-provider>
</n-audio>
```

## Data Items

### hasAudio

    {{audio:hasAudio}}

### isPlaying

    {{audio:isPlaying}}

### currentMusic

    {{audio:currentMusic}}

### loadedMusic

    {{audio:loadedMusic}}

### queuedMusic

    {{audio:queuedMusic}}

### currentSound

    {{audio:currentSound}}

### loadedSounds

    {{audio:loadedSounds}}