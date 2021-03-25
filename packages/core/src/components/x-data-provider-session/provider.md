# Session Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across page-refreshes during a single browsing sessions.

Browser Session: **session**

## Installation

The session provider is registered using a component **[\<x-data-provider-session\>](/components/x-data-provider-session)**.

```html
<x-data-provider-session prefix="x" name="session">
</x-data-provider-session>
```

### Session Storage

This store is short-lived and used to track 'session visits' and other temporary values.

Provider Key: '**session**'

`{<name>:(<key>}`
