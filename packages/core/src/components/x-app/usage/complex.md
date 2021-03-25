
The example sets an offset for scrolling, a global page transition and has a non-default start page.

```html
<x-app app-title='Sample Site' 
  scroll-top-offset='0' 
  transition='fade-in' 
  start-url='/home' 
  >
  ...
  <x-app-view ...></x-app-view>
  <x-app-view ...></x-app-view>
  ...
</x-app>
```