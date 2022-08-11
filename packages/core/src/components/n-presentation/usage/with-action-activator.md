```html
<n-presentation>
  <n-presentation-timer duration="3">
  </n-presentation-timer>
  <n-action-activator activate='at-time' 
    time='2'>
    <n-action 
      topic="elements"
      command="add-class" 
      data-selector="#animation"
      data-class=".fadeIn">
    </n-action>
  </n-action-activator>
</n-presentation>
```