# Session Data Providers

This provider uses the built-in key-value store in the browser to persist data across page refreshes during a single browsing session.

> ℹ️ Note: Data Providers are a read-only data store used by NENT to resolve data expressions.

## Installation

The session provider is registered using the **[\<n-data-session\>](/components/n-data-session)** element.

```html
<n-data-session prefix="x" name="session">
</n-data-session>
```

### Sample Token

Provider Key: '**session**'

Sample Token: `{{session:key}}`

> ℹ️ Note: Where key is the key of the value you are displaying
