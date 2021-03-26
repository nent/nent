# X-UI

This component enables the UI plugin listener. This is required to add UI components that are activated using actions.

```html
<n-app>
</n-app>
```


<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property         | Attribute         | Description                                                                               | Type      | Default |
| ---------------- | ----------------- | ----------------------------------------------------------------------------------------- | --------- | ------- |
| `debug`          | `debug`           | Turn on debugging to get helpful messages from the app, routing, data and action systems. | `boolean` | `false` |
| `disableActions` | `disable-actions` | Turn off declarative actions for the entire app.                                          | `boolean` | `false` |


## Events

| Event          | Description                                                                                                                  | Type               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `nent:actions` | These events are **`<n-views>`** command-requests for action handlers to perform tasks. Any handles should cancel the event. | `CustomEvent<any>` |
| `nent:events`  | Listen for events that occurred within the **`<n-views>`** system.                                                           | `CustomEvent<any>` |


----------------------------------------------

nent 2021 - all rights reserved
