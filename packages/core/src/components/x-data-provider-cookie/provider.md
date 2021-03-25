# Session Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across page-refreshes during a single browsing sessions.

Cookies: **cookie** `<x-data-provider-cookie>`

## Installation

The cookie provider is registered using a component **[\<x-data-provider-cookie\>](/components/x-data-provider-cookie)**.

```html
<x-data-provider-cookie name="cookie"> </x-data-provider-cookie>
```

### Cookie Storage

This store is long-lived from the same browser, but for very small data items.

Provider Key: '**cookie**'

`{cookie:(key)}`
