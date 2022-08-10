# N-CONTENT

This component should surround the inner-content of a remote HTML file that can be prioritized during SPA navigation. When pulled in using `n-content-include`, `n-view`, or `n-view-prompt` the content area inside will be fetched with the rest of the HTML ignored. This provides a hybrid SSG+SPA approach to navigation for great SEO scores and snappy navigation.

## Example
#### /index.html
```html
<html>
  <head>
    ...
  </head>
  <body>
    <header>
      <nav>...</nav>
    </header>
    <main>
      <n-views>
        <n-view path="/" 
          page-title="Home">
          Home Page Content
        </n-view>
        <n-view path="about-us"
          page-title="About Us" 
          src="/about-us/index.html">
          <!-- Only the n-content's innerHTML is rendered:
          <section>
            My page's content.
          </section>
           -->
        </n-view>
      </n-views>
    </main>
    <footer>
      ...
    </footer>
  </body>
```

#### /about-us/index.html
```html
<html>
  <head>
    ...
  </head>
  <body>
    <header>
      <nav>...</nav>
    </header>
    <main>
      <n-content>
        <section>
          My page's content.
        </section>
      </n-content>
    </main>
    <footer>
      ...
    </footer>
  </body>
```

```html
<>
```

<!-- Auto Generated Below -->


----------------------------------------------

NENT v0.10.8 - Copyright 2022 [all rights reserved]
