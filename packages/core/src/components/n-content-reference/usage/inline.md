### Ensure Inline Reference

```html
<html>
  <head></head>
  <body>
    <n-content-reference style-src='assets/styles.css' inline />
  </body>
</html>
```

**Results**:

```html
<html>
  <head></head>
  <body>
    <n-content-reference style-src='assets/styles.css'>
      <link rel='stylesheet' href='assets/styles.css' />
    </n-content-reference>
  </body>
</html>
```

