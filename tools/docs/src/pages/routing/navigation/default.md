```html
<n-views>
  <n-view path="page-1" page-title="Page 1">
    <h1>Hello World!</h1>
    <n-view-link-next></n-view-link-next>
  </n-view>
  <n-view path="page-2" page-title="Page 2">
    <h1>Another Page</h1>
    <n-view-link-back></n-view-link-back>
  </n-view>
</n-views>
```

Guided navigation uses a convention-based approach to determine the intended navigation scheme, based on the `n-view` structure and order. 

> ℹ️ Note: You can provide expressions on routes using the `when` attribute as well as a `visit` strategy to create rule-based navigation. All navigation elements respect those rules and support `n-view-prompt` to collect consent, data and/or present one-time notifications.