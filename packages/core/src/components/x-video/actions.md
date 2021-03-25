# Video Actions

The Video Action Listener is configured to handle commands raised through the [actions system](/actions).

Topic: `video`

```html
<x-action-activator activate="...">
  <x-action topic="video" 
    command="<command>" 
    data-(key)="(value)"></x-action>
</x-action-activator>
```

## Commands

### `pause`

Tells the active video to pause.


```html
<x-action-activator activate="...">
  <x-action topic="video" 
    command="pause" ></x-action>
</x-action-activator>
```

### `play`

Tells the active video to play, if auto-play was not enabled or if a user has yet to interact with the UI.


```html
<x-action-activator activate="...">
  <x-action topic="video" 
    command="play" ></x-action>
</x-action-activator>
```

### `resume`

Tells the active video to resume after being paused.


```html
<x-action-activator activate="...">
  <x-action topic="video" 
    command="resume" ></x-action>
</x-action-activator>
```

### `mute`

Tells the active video to mute its sound.

```html
<x-action-activator activate="...">
  <x-action topic="video" 
    command="mute" ></x-action>
</x-action-activator>
```
