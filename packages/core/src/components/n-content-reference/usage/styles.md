### Ensure Style Reference

```html
<html>
  <head></head>
  <body>
    <n-content-reference style-src='assets/styles.css' />
  </body>
</html>
```

**Results**:

```html
<html>
  <head>
    <link rel='stylesheet' href='assets/styles.css' />
  </head>
  <body>
    <n-content-reference style-src='assets/styles.css' />
  </body>
</html>
```
