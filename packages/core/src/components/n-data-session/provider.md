# Session Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across page-refreshes during a single browsing sessions.

Browser Session: **session**

## Installation

The session provider is registered using a component **[\<n-data-session\>](/components/n-data-session)**.

```html
<n-data-session prefix="x" name="session">
</n-data-session>
```

### Session Storage

This store is short-lived and used to track 'session visits' and other temporary values.

Provider Key: '**session**'

`{<name>:(<key>}`
