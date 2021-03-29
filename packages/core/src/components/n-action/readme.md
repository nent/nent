# N-ACTION

This element holds the data that **is** the Action submitted through [Actions](/actions) bus. The parent tag defines how and when the child actions are submitted through [Actions](/actions).

> This element does not activate these actions automatically. They need to be activated through script, or by wrapping them in an [\<n-action-activator\>](/components/n-action-activator) tag.


## Element

```html
<n-action 
  topic='<topic>'
  command='<command>'
  data-(key)='value'>
</n-action>
```

<!-- Auto Generated Below -->


## Usage

### Basic

For most action-argument data, it is easies to specify them as key-value pairs using the `data-*` attributes within the `n-action` tag. The name of the argument should be prefixed with `data-`. A

```html
<n-action topic='<topic>'
  command='<command>'
  data-(key)='value'>
</n-action>
```

> NOTE: If a listener declares an argument using 'camelCase', it should be converted to 'kebab-case' in HTML, (words separated by dashes, all lowercase). It will be converted to 'camelCase' automatically when activated.


#### Real example

```html
<n-action topic='navigation'
  command='go-to'
  data-path='/some/path'>
</n-action>
```


### Input data

For most data, it is easy to specify key-value pairs using the `data-*` attributes within the `n-action` tag.

```html
<n-action topic='<topic>'
  command='<command>'>
  <input type='hidden'
    name='arg1'
    value='Hello World'>
</n-action>
```


### Script data

For more complex data shapes, you can define the data parameters as JSON in a child script tag.

```html
<n-action topic='<topic>' command='<command>'>
  <script type='application/json'>
    {
      'arg1': 'Hello world!'
    }
  </script>
</n-action>
```



## Properties

| Property               | Attribute | Description                                         | Type     | Default     |
| ---------------------- | --------- | --------------------------------------------------- | -------- | ----------- |
| `command` _(required)_ | `command` | The command to execute.                             | `string` | `undefined` |
| `topic` _(required)_   | `topic`   | This is the topic this action-command is targeting. | `string` | `undefined` |


## Methods

### `getAction() => Promise<EventAction<any> | null>`

Get the underlying actionEvent instance. Used by the n-action-activator element.

#### Returns

Type: `Promise<EventAction<any> | null>`



### `sendAction(data?: Record<string, any> | undefined) => Promise<void>`

Send this action to the the action messaging system.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT 2021 - all rights reserved
