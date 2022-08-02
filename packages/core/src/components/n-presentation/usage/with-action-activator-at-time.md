```html
<n-presentation>
  <n-video ...>
  </n-video>
  <n-action-activator activate='at-time-end'>
    <n-action 
      topic="elements"
      command="add-class" 
      data-selector="#animation"
      data-class=".fadeIn">
    </n-action>
  </n-action-activator>
</n-presentation>
```
> ℹ️ Note: The `at-time=end` activation-strategy fires when the duration is up or the video ends..