# Session Data Providers

This provider uses a browser cookie to store key-value pairs. The data provider allows for displaying or using cookie data in NENT.

This store is long-lived from the same browser, but for very small data items.

> Data Providers are a read-only data store used by NENT to resolve data expressions.

## Installation

The cookie provider is registered using the **[\<n-data-cookie\>](/components/n-data-cookie)** element.

```html
<n-data-cookie name="cookie"> </n-data-cookie>
```

### Sample Token

Provider Key: '**cookie**'

Sample Token: `{{cookie:key}}`

> Where key is the key of the value you are displaying