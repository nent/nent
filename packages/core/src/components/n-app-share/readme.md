# N-APP-SHARE

The `<n-app-share>` element description


<!-- Auto Generated Below -->


## Overview

This element leverages the browser's web-share
API to give the application a native-app feel.

## Usage

### Basic

Using the `<n-app-share>` element.

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

### `share(data?: { title?: string; text?: string; url?: string; } | null) => Promise<void>`

Manual share method for more complex scenarios

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT v0.10.8 - Copyright 2022 [all rights reserved]
