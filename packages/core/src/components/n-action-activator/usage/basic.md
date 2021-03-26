## Basic Usage

This element should only ever contain child [\<n-action\>](/components/n-action) tags. The attributes tells the parent The parent tag defines how and when the child actions are submitted through the [actions system](/actions).

```html
<n-action-activator
  activate='<activation-strategy>'
  ...
  supporting
  attributes
  ...
>
  <n-action ...></n-action>
  <n-action ...></n-action>
  <n-action ...></n-action>
</n-action-activator>
```
