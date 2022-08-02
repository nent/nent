# Storage Data Providers

This provider uses the built-in key-value store in the browser to persist data across browsing sessions within the same browser.

> ℹ️ Note: Data Providers are a read-only data store used by NENT to resolve data expressions.

## Installation

The storage provider is registered using the **[\<n-data-storage\>](/components/n-data-storage)** element.

```html
<n-data-storage 
  prefix="x" 
  name="storage">
</n-data-storage>
```

### Sample Token

Provider Key: '**storage**'

Sample Token: `{{storage:key}}`

> ℹ️ Note: Where key is the key of the value you are displaying