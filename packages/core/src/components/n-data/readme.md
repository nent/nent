# N-DATA

The `<n-data>` element enables the data system. Once enabled, [data expressions](/data/expressions) can be used to inject data into the [content](/content) or used for [ navigation](/routing/navigation).

> See [data](/data) for full documentation


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

| Property          | Attribute          | Description                                                                                                                                                                                                  | Type                  | Default     |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `debug`           | `debug`            | Turn on debugging to get helpful messages from the data action systems.                                                                                                                                      | `boolean`             | `false`     |
| `providerTimeout` | `provider-timeout` | The wait-time, in seconds to wait for un-registered data providers found in an expression. This is to accommodate a possible lag between evaluation before the first predicate and the registration process. | `number`, `undefined` | `undefined` |


----------------------------------------------

NENT 2021 - all rights reserved
