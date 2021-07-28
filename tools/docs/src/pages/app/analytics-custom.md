```html
<n-action-activator target-element="input[type=button]"
  debug>
  <n-action topic="analytics"
    command="send-event">
    <input type="button"
      class="btn btn-info"
      name="clicked"
      value="Button 1" />
  </n-action>
</n-action-activator>
```