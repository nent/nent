
### Page content

The following is the HTML on this page.

```html
<h1>
  Learn about
  <x-data-display text="{{route:item}}">
  </x-data-display></h1>
<p>Excellent choice, {{storage:name}}.</p>
<x-data-display>
  <template>
    <h2>Learn About '{{route:item}}'</h2>
    <p>{{storage:name}}, you picked a good one!</p>
    <img style="width: 50%" src="https://source.unsplash.com/random/500x200?{{route:item}}" />
  </template>
</x-data-display>
```

### Route Definition

The following illustrates how the route was configured.

```html
<x-app-view url="/data" page-title="Data Routes">
  <x-app-view url="/:item" page-title="Info on {{route:item}}">
    ... this content ...
  </x-app-view>
</x-app-view>
```