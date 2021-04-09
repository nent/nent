# N-APP-SHARE

The `<n-app-share>` component description


<!-- Auto Generated Below -->


## Usage

### Basic

Using the `<n-app-share>` component.

```html
<n-app-share 
  headline=""
  url=""
  text="">
</n-app-share>
```



## Properties

| Property   | Attribute  | Description                   | Type                  | Default     |
| ---------- | ---------- | ----------------------------- | --------------------- | ----------- |
| `headline` | `headline` | Headline for the share        | `string`, `undefined` | `undefined` |
| `text`     | `text`     | The textual body of web share | `string`, `undefined` | `undefined` |
| `url`      | `url`      | The URL we are sharing        | `string`, `undefined` | `undefined` |


## Methods

### `share(data?: { title?: string | undefined; text?: string | undefined; url?: string | undefined; } | null | undefined) => Promise<void>`

Manual share method for more complex scenarios

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT 2021 - all rights reserved
