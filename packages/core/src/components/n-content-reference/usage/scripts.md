
### Ensure Script References

```html
<html>
  <head></head>
  <body>
    <n-view url='/home'>
      <n-content-reference script-src='lib/script.js' />
    </n-view>
    <n-view url='/page-1'>
      <n-content-reference script-src='lib/script.js' />
    </n-view>
  </body>
</html>
```

**Results**:

```html
<html>
  <head>
    <script src='lib/script.js'></script>
  </head>
  <body>
    <n-view url='/home'>
      <n-content-reference script-src='lib/script.js' />
    </n-view>
    <n-view url='/page-1'>
      <n-content-reference script-src='lib/script.js' />
    </n-view>
  </body>
</html>
```