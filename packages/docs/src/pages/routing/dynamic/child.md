
### Page content

The following is the HTML on this page.

```html
<h1>
  Learn about
  <n-content-data text="{{route:item}}">
  </n-content-data></h1>
<p>Excellent choice, {{storage:name}}.</p>
<n-content-data>
  <template>
    <h2>Learn About '{{route:item}}'</h2>
    <p>{{storage:name}}, you picked a good one!</p>
    <img style="width: 50%" src="https://source.unsplash.com/random/500x200?{{route:item}}" />
  </template>
</n-content-data>
```

### Route Definition

The following illustrates how the route was configured.

```html
<n-view url="/data" page-title="Data Routes">
  <n-view url="/:item" page-title="Info on {{route:item}}">
    ... this content ...
  </n-view>
</n-view>
```