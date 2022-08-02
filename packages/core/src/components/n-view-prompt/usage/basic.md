
Much like its parent, [\<n-view\>](/components/n-view), basic routing information is required.

```html
<n-view ...>
  <n-view-prompt
    path='<sub-path>'
    page-title='<route title>'
    visit='always|once|optional'
    when='<expression predicate>'
    src='<remote html with route sand children>'
    content-src='<remote content html>'
    transition='<animation-enter>'
    scroll-top-offset=''
  >
    ...
  </n-view-prompt>
  ...
</n-view>
```

> ℹ️ Note: The **when** attribute is a data expression that overrides the **visit** strategy. It is a predicate that produces a boolean result. **true: visit=always** false: visit=optional