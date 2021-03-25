## Basic Usage

This element should only ever contain child [\<x-action\>](/components/x-action) tags. The attributes tells the parent The parent tag defines how and when the child actions are submitted through the [actions system](/actions).

```html
<x-action-activator
  activate='<activation-strategy>'
  ...
  supporting
  attributes
  ...
>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
</x-action-activator>
```
