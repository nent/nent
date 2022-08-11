### At Time

Activation occurs when the presentation has been playing for the given time within the **time** attribute.

```html
<n-presentation>
  <n-presentation-timer duration="3">
  </n-presentation-timer>
  <n-action-activator 
    activate='AtTime' 
    time='3'>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-presentation>
```

> ℹ️ Note: The `at-time` activation-strategy only works when this element is a child of  [`n-presentation`](/components/n-presentation).
