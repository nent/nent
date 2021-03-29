# N-DATA

The `<n-data>` component enables the data system. Once enabled, [data expressions](/data/expressions) can be used to inject data into the [content](/content) or used for [ navigation](/routing/navigation).

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

| Property          | Attribute          | Description                                                                                                                                                                                                                     | Type     | Default |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `providerTimeout` | `provider-timeout` | The wait-time, in milliseconds to wait for un-registered data providers found in an expression. This is to accommodate a possible lag between evaluation before the first view-do 'when' predicate an the registration process. | `number` | `500`   |


----------------------------------------------

NENT 2021 - all rights reserved
