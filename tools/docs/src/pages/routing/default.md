```html
<n-views
  app-title="My HTML App"
  start-path="/home">
  <header>
    <!-- visible to all pages -->
    App Name
  </header>
  <n-view
    path="/home"
    page-title="Home">
    <nav class="subnav">
      <!-- visible to all /home/* routes -->
      <h1>Home</h1>
    </nav>
    <div class="container"
      slot="content">
      <hr />
      <h2>Hello World!</h2>
      <p>Now you have a basic content router.</p>

      <a href="/home/nested">
        Nested Page</a>
      <a href="about">
        Sibling Page</a>
    </div>
    <n-view
      path="nested"
      page-title="Nested"
      n-cloak>
      <div
        class="container"
        slot="content">
        <h1>Nested</h1>
        <hr />
        <h2>A child page</h2>

        <a href="">Back to Home</a>
      </div>
    </n-view>
  </n-view>
  <n-view
    path="/about"
    page-title="About"
    n-cloak>
    <div class="container"
      slot="content">
      <h1>Sibling Page</h1>
      <h2>You now have a multi-page app!</h2>
      <a href="/home">Back to Home</a>
    </div>
  </n-view>
</n-views>
```
> ℹ️ Note: **TIP:** Content that should only appear on a route, and not a child route should be inserted using
> ℹ️ Note: the `slot="content"` attribute.