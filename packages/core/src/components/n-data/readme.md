# X-DATA

The `<n-data>` component enables the data system. Once enabled, [data expressions](/data/expressions) can be used to inject data int the [content](/content/data) or used for [guided navigation](/navigation/guided).


Data Token Format:  `{{<provider>:<data-key>(?<default>)}}`

**provider**: the data provider name
**data-key**: the data value key within the provider \*
**default**: optional default value if the provider's key is empty.

\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression `{{session:user.name}}` means the session value 'user' is a JSON object, parse it and replace with the 'name' property._

> See [data expressions](/data/expressions) for full documentation

**Providers:**

* **session**: Browser Session
* **storage**: Browser Storage
* **cookie**: Cookies
* **route**: Route
* **query**: Query
* **data**: Inline Data

> See [data providers](/data/providers) to learn how to add custom data providers.

<!-- Auto Generated Below -->


## Usage

### Add-session

Enable the data provider system and add storage data as a provider.

```html
<n-data>
  <n-data-session></n-data-session>
</n-data>
```


### Add-storage

Enable the data provider system and add storage data as a provider.

```html
<n-data>
  <n-data-storage></n-data-storage>
</n-data>
```


### Basic

Enable the data provider system to enable token replacement.

```html
<n-data> </n-data>
```



## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                     | Type     | Default |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `providerTimeout` | `provider-timeout` | The wait-time, in milliseconds to wait for un-registered data providers found in an expression. This is to accommodate a possible lag between evaluation before the first view-do 'when' predicate an the registration process. | `number` | `500`   |


----------------------------------------------

nent 2021 - all rights reserved
