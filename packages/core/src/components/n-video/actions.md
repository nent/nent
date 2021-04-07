# Video Actions

The Video Action Listener is configured to handle commands raised through the [actions system](/actions).

## Topic: `video`

```html
<n-action-activator activate="...">
  <n-action topic="video" 
    command="<command>" 
    data-(key)="(value)"></n-action>
</n-action-activator>
```

## Commands

### `pause`

Tells the active video to pause.


```html
<n-action-activator activate="...">
  <n-action topic="video" 
    command="pause" ></n-action>
</n-action-activator>
```

### `play`

Tells the active video to play, if auto-play was not enabled or if a user has yet to interact with the UI.


```html
<n-action-activator activate="...">
  <n-action topic="video" 
    command="play" ></n-action>
</n-action-activator>
```

### `resume`

Tells the active video to resume after being paused.


```html
<n-action-activator activate="...">
  <n-action topic="video" 
    command="resume" ></n-action>
</n-action-activator>
```

### `mute`

Tells the active video to mute its sound.

```html
<n-action-activator activate="...">
  <n-action topic="video" 
    command="mute" ></n-action>
</n-action-activator>
```
