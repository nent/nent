
The example sets an offset for scrolling, a global page transition and has a non-default start page.

```html
<n-views app-title='Sample Site' 
  scroll-top-offset='0' 
  transition='fade-in' 
  start-url='/home' 
  >
  ...
  <n-view ...></n-view>
  <n-view ...></n-view>
  ...
</n-views>
```