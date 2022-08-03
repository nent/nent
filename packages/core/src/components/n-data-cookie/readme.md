# N-DATA-COOKIE

This element enables the **Cookie Data Provider**, after requesting consent from the user. The consent message and the accept/reject button are customizable.

## Cookie Data Provider

This store is long-lived from the same browser, but for very small data items. This provider enables you to use cookie data in your HTML.

Provider Key: '**cookie**'

`{{cookie:(key)}}`

When included on the page, this element automatically shows a banner to collect consent from the user. You MUST supply clickable elements and decorate them with **n-accept** and **n-reject** attributes, respecting the user's decision.

The element listens for their click events and acts accordingly.

```html
<n-data-cookie>
  <p>Cookies help us track your every move.</p>
  <button n-accept>Accept</button>
  <button n-reject>Decline</button>
</n-data-cookie>
```

> ℹ️ Note: The HTML inside the element is shown directly on the banner. Use it to display your terms, privacy policy and explanation for using the cookie.

Alternatively, you can skip this by including the 'skip-consent' attribute.

```html
<n-data--cookie skip-consent></n-data--cookie>
```

<!-- Auto Generated Below -->


## Usage

### Basic





## Properties

| Property      | Attribute      | Description                                                                                             | Type      | Default    |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| `name`        | `name`         | Provider name to use in nent expressions.                                                               | `string`  | `'cookie'` |
| `skipConsent` | `skip-consent` | When skipConsent is true, the accept-cookies banner will not be displayed before accessing cookie-data. | `boolean` | `false`    |


## Events

| Event        | Description                                             | Type                                   |
| ------------ | ------------------------------------------------------- | -------------------------------------- |
| `didConsent` | This event is raised when the user consents to cookies. | `CustomEvent<{ consented: boolean; }>` |


## Methods

### `registerProvider() => Promise<void>`

Immediately register the provider.

#### Returns

Type: `Promise<void>`




----------------------------------------------

NENT v0.10.6 - Copyright 2022 [all rights reserved]
