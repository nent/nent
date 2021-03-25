# X-ACTION

This element holds the data that **is** the Action submitted through [Actions](/actions). The parent tag defines how and when the child actions are submitted through [Actions](/actions).

> This element does not activate these actions automatically. They need to be activated through script, or by wrapping them in an [\<x-action-activator\>](/components/x-action-activator) tag.


## Element

```html
<x-action 
  topic='<topic>'
  command='<command>'
  data-(key)='value'>
</x-action>
```

<!-- Auto Generated Below -->


## Usage

### Basic

For most action-argument data, it is easies to specify them as key-value pairs using the `data-*` attributes within the `x-action` tag. The name of the argument should be prefixed with `data-`. A

```html
<x-action topic='<topic>'
  command='<command>'
  data-(key)='value'>
</x-action>
```

> NOTE: If a listener declares an argument using 'camelCase', it should be converted to 'kebab-case' in HTML, (words separated by dashes, all lowercase). It will be converted to 'camelCase' automatically when activated.


#### Real example

```html
<x-action topic='navigation'
  command='go-to'
  data-path='/some/path'>
</x-action>
```


### Input data

For most data, it is easy to specify key-value pairs using the `data-*` attributes within the `x-action` tag.

```html
<x-action topic='<topic>'
  command='<command>'>
  <input type='hidden'
    name='arg1'
    value='Hello World'>
</x-action>
```


### Script data

For more complex data shapes, you can define the data parameters as JSON in a child script tag.

```html
<x-action topic='<topic>' command='<command>'>
  <script type='application/json'>
    {
      'arg1': 'Hello world!'
    }
  </script>
</x-action>
```



## Properties

| Property               | Attribute | Description                                         | Type     | Default     |
| ---------------------- | --------- | --------------------------------------------------- | -------- | ----------- |
| `command` _(required)_ | `command` | The command to execute.                             | `string` | `undefined` |
| `topic` _(required)_   | `topic`   | This is the topic this action-command is targeting. | `string` | `undefined` |


## Methods

### `getAction() => Promise<EventAction<any> | null>`

Get the underlying actionEvent instance. Used by the x-action-activator element.

#### Returns

Type: `Promise<EventAction<any> | null>`



### `sendAction(data?: Record<string, any> | undefined) => Promise<void>`

Send this action to the the action messaging system.

#### Returns

Type: `Promise<void>`




----------------------------------------------

nent 2021 - all rights reserved
