# Session Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across page-refreshes during a single browsing sessions.

Cookies: **cookie** `<n-data-cookie>`

## Installation

The cookie provider is registered using a component **[\<n-data-cookie\>](/components/n-data-cookie)**.

```html
<n-data-cookie name="cookie"> </n-data-cookie>
```

### Cookie Storage

This store is long-lived from the same browser, but for very small data items.

Provider Key: '**cookie**'

`{cookie:(key)}`
