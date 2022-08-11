#### At Time End
> ℹ️ Note: The `at-time=end` activation-strategy only works when this element is a child of  [`n-presentation`](/components/n-presentation).

```html

<n-presentation>
  <n-video ...>
  </n-video>
  <n-action-activator activate='AtTime' 
    time='3'>
    <n-action ...></n-action>
    <n-action ...></n-action>
  </n-action-activator>
</n-presentation>

> ℹ️ Note: For more information on presentation and how they work, see  [`n-presentation`](/components/n-presentation)