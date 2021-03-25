# Storage Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across browsing sessions within the same browser.

Browser Storage: **storage**

## Installation

The storage provider is registered using a component **[\<x-data-provider-storage\>](/components/x-data-provider-storage)**.

```html
<x-data-provider-storage 
  prefix="x" 
  name="storage">
</x-data-provider-storage>
```

## Local Storage

This store is long-lived from the same browser. and used to track 'session visits' and other temporary values.

Provider Key: '**storage**'

`{<name>:(<key>}`
