```html
<n-views>
  <n-view path="page-1" page-title="Page 1">
    <h1>Hello World!</h1>
    <n-view-link-list mode="siblings"></n-view-link-list> // will list page-1 & page-2
  </n-view>
  <n-view path="page-2" page-title="Page 2">
    <h1>Another Page</h1>
    <n-view-link-list mode="siblings"></n-view-link-list> // will list page-1 & page-2
  </n-view>
</n-views>
```