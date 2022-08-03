### On Render

This activation-strategy fires as soon as the activator component renders. It can be pulled in through remote templates or added to a page for analytics.

```html
<n-action-activator activate='on-render'>
  <n-action ...></n-action>
  <n-action ...></n-action>
  <n-action ...></n-action>
</n-action-activator>
```

> ℹ️ Note: The `on-exit` activation-strategy only works when this element is a child of  [`n-view`](/components/n-view) or [`n-view-prompt`](/components/n-view-prompt).
