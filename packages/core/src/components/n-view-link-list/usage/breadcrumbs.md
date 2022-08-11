A breadcrumb menu that displays the current route and it parent routes.

```html
<nav aria-label="breadcrumb"
  class="bread-nav container text-end">
  <n-view-link-list class="" mode="parents"
    list-class="breadcrumb justify-content-start"
    active-class="active"
    item-class="breadcrumb-item"
    exclude-root>
  </n-view-link-list>
</nav>
```