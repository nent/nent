# N-AUDIO: Actions

The Audio Action Listener listens for action commands to control audio during presentations.

TOPIC: `audio`

```html
<n-action-activator activate="...">
  <n-action topic="" command="<command>" data-(key)="(value)">
  </n-action>
</n-action-activator>
```

## Commands

### `enable`

This command enables audio for all music, sound and video.

```html
<n-action-activator 
  activate="...">
  <n-action 
    topic="audio" 
    command="enable">
  </n-action>
</n-action-activator>
```

### `disable`

This command disables audio for all music, sound and video.

```html
<n-action-activator 
  activate="...">
  <n-action 
    topic="audio" 
    command="set-data" 
    data-(key)="(value)">
  </n-action>
</n-action-activator>
```

## Special Commands

Audio components have special action tags, to help shape the resulting action message.

### `load`

This command enables audio for all music, sound and video.

Arguments:

- **key** [required]\
  The input key to the experience input to update.

- **value** [required]\
  The value to set.

```html
<n-action-activator 
  activate="...">
  <n-action 
    topic="audio" 
    command="set-data" 
    data-(key)="(value)">
  </n-action>
</n-action-activator>
```
### Commands

#### start

This command instructs the player to immediately play the given pre-loaded track based on the **track-id**. If the track isn't present in the loader, this command is ignored.

#### pause

This command pauses audio if something is playing.

#### resume

This command resumes audio if it was paused.

#### mute

This command instructs the player to set its own 'muted' property to the value in the payload. Meaning the same command is used for mute and un-mute.


#### volume

Set the audio player volume at a level 0 to 100.

#### seek \*

Set the audio track to the given time in seconds, but only if the **track-id** matches that of the active track. Otherwise, it is ignored. If the current track is paused, it will remain paused, at the requested time. Otherwise, the track is changed audibly.

#### Other Commands

#### play

This command instructs the player to immediately play this audio clip. If a track is currently playing (on the respective player), it is stopped and discarded.

**Data**:

```json
{
  'id': '<id>',
  'type': 'music|sound',
  'src': '<file>',
  'discard': '<discard-strategy>',
  'loop': false,
  'track': false
}
```

#### queue

This is the primary method for loading audio tracks to the player. It instructs the player to play this as soon as the player becomes available, but after anything that is currently playing.

**Data**:

```json
{
  'id': '<id>',
  'type': 'music|sound',
  'src': '<file>',
  'discard': '<discard-strategy>',
  'loop': false,
  'track': false
}
```

#### load

This command instructs the player to pre-load the file with the browser but do not play it until instructed by the **play** command, presumably at a given time. This method is helpful for large audio tracks that need to be ready to go at exactly the right time.

**Data**:

```json
{
  'id': '<id>',
  'type': 'music|sound',
  'src': '<file>',
  'discard': '<deactivation-strategy>',
  'loop': false,
  'track': false
}
```