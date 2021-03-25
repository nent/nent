# X-DATA

The `<x-data>` component enables the data system. Once enabled, [data expressions](/data/expressions) can be used to inject data int the [content](/content/data) or used for [guided navigation](/navigation/guided).

Data-providers are used to resolve values in the data-expressions. See [Data Providers](/data/providers) for more information.

<!-- Auto Generated Below -->


## Usage

### Add-session

Enable the data provider system and add storage data as a provider.

```html
<x-data>
  <x-data-provider-session></x-data-provider-session>
</x-data>
```


### Add-storage

Enable the data provider system and add storage data as a provider.

```html
<x-data>
  <x-data-provider-storage></x-data-provider-storage>
</x-data>
```


### Basic

Enable the data provider system.

```html
<x-data> </x-data>
```



## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                     | Type     | Default |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `providerTimeout` | `provider-timeout` | The wait-time, in milliseconds to wait for un-registered data providers found in an expression. This is to accommodate a possible lag between evaluation before the first view-do 'when' predicate an the registration process. | `number` | `500`   |


----------------------------------------------

nent 2021 - all rights reserved
