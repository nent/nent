 You can inject data into HTML templates using the [`n-content-template`](/components/n-content-template) element.
 
 ### Using Inline json


 ```html
  <n-content-template>
    <script type="application/json">
      {
        "name":"Sally"
      }
    </script>
    <template>
      <blockquote>
        {{data:name}}
      </blockquote>
    </template>
  </n-content-template> 
```
#### Results

> ℹ️ Note: Sally

### Attributes & Tokens

```html
<n-content-template data-greet="Hello there!">
  <template>
    <blockquote>
      {{data:greet}} {{storage:name}}
    </blockquote>
  </template>
</n-content-template>
```

#### Results