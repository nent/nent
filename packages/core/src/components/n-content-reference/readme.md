# N-CONTENT-REFERENCE

This component makes a single reference to script and CSS sources. It can be used by HTML fragments to ensure a reference is made, without worry that it will create duplicate references.

If inline is present, the source would be nested inside this element, otherwise, it is appended to the head.

## Element 

```html
<n-content-reference
  script-src='<url>'
  style-src='<url>'>
</n-content-reference>
```

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property    | Attribute    | Description                                                                                                  | Type                  | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `deferLoad` | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`             | `false`     |
| `inline`    | `inline`     | When inline the link/script tags are rendered in-place rather than added to the head.                        | `boolean`             | `false`     |
| `module`    | `module`     | Import the script file as a module.                                                                          | `boolean`             | `false`     |
| `noModule`  | `no-module`  | Declare the script only for use when modules aren't supported                                                | `boolean`             | `false`     |
| `scriptSrc` | `script-src` | The script file to reference.                                                                                | `string`, `undefined` | `undefined` |
| `styleSrc`  | `style-src`  | The css file to reference                                                                                    | `string`, `undefined` | `undefined` |
| `timeout`   | `timeout`    | Timeout (in milliseconds) to wait for the references to load.                                                | `number`              | `1000`      |


## Events

| Event        | Description                                                                                                                                                                      | Type                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `referenced` | This event is fired when the script and style elements are loaded or timed out. The value for each style and script will be true or false, for loaded or timedout, respectively. | `CustomEvent<{ type: ReferenceType; loaded: boolean; }>` |


## Methods

### `forceLoad() => Promise<void>`

Force the 'load' event of the script or link element.
This is meant for testing.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [n-audio](../n-audio)

### Graph
```mermaid
graph TD;
  n-audio --> n-content-reference
  style n-content-reference fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

NENT 2021 - all rights reserved
